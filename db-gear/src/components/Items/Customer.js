import React, { useEffect, useMemo } from 'react';
import ReactDataGrid from 'react-data-grid';
import { 
    Grid, 
    Button, 
    SwipeableDrawer, 
    AppBar, 
    Toolbar,
    TextField,
    Tooltip,
    IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Edit, Delete, Save, Cancel, Search, Refresh } from '@material-ui/icons';
import { withFormik } from 'formik';
import _ from 'lodash';

import EmptyRowsView from './EmptyRowsView';
import API from '../API';
import ConfirmDialog from './Dialogs/ConfirmDialog';
import * as Yup from 'yup';
import FormGenerator from './Form/FormGenerator';
import DynamicSnackbar from './Snackbar/DynamicSnackbar';
import SearchBar from './SearchBar/SearchBar';



const defaultColumnConfig = {
    resizable: true,
    width: 120
}

const cols = [
    {key: "id", name: "Identification", frozen: true, type: String},
    {key: "name", name: "LastName", frozen: true, type: String},
    {key: "sex", name: "Sex", type: ['M', 'F']},
    {key: "address", name: "Address", type: String},
    {key: "user_type", name: "Type", type: ['Guest','Patron']},
    {key: "username", name: "Username", type: String},
    {key: "password", name: "Password", type: String},
    {key: "point", name: "Point", type: Number}
].map(col => ({...col, ...defaultColumnConfig}));
const fields = cols.map(({key, name}) => ({id: key, text: name}));

const validationSchema = Yup.object().shape({
    id: Yup.string().required('Identification is required').length(9, 'ID must have 9 digits').matches(/[0-9]{9}/, 'Invalid ID'),
    name: Yup.string().required('Name is required'),
    sex: Yup.string().required('Sex is required'),
    address: Yup.string().required('Address is required'),
    username: Yup.string().min(4).max(24).matches(/[_a-zA-Z][a-zA-Z0-9]*/, 'Invalid username').nullable(),
    password: Yup.string().min(1).max(32).matches(/[_a-zA-Z][a-zA-Z0-9]*/, 'Invalid password').nullable()
});

const styles = theme => ({
    actionWrapper: {
        minHeight: '35px',
        paddingTop: '10px',
    },
    buttonWrapper: {
        backgroundColor: '#fff',
        padding: '0px 40px 40px'
    },
    modifyButton: {
        backgroundColor: '#fcd217',
        color: '#fff',
        padding: '5px 10px',
        '&:hover,&:focus': {
            backgroundColor: '#dbaa07',
        }
    },
    deleteButton: {
        backgroundColor: '#fc1758',
        color: '#fff',
        padding: '5px 10px',
        '&:hover': {
            backgroundColor: '#ba0f50',
        }
    },
    saveButton: {
        backgroundColor: '#1fed78',
        color: '#fff',
        padding: '5px 10px',
        '&:hover,&:focus': {
            backgroundColor: '#14b86e',
        }
    },
    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        height: '100px'
    },
        searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        margin: '10px',
        display: 'block',
    },
    addUser: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px 16px',
    },
});



function Customer(props) {
    const [customers, setCustomers]       = React.useState([]);
    const [values, setValues]             = React.useState({});
    const [query, setQuery]               = React.useState('');
    const [updateDrawer, setUpdateDrawer] = React.useState(false);
    const [insertDrawer, setInsertDrawer] = React.useState(false);
    const [deleteDialog, setDeleteDialog] = React.useState(false);
    const [updateDialog, setUpdateDialog] = React.useState(false);
    const [insertDialog, setInsertDialog] = React.useState(false);
    const [cancelDialog, setCancelDialog] = React.useState(false);
    const [formChanged, setFormChanged]   = React.useState(false);
    const [formValid, setFormValid]       = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState({open: false, variant: 'success', message: 'Hello, world'});

    const fetchCustomer = async () => {
        try {
            const response = await API.get(`customer`);
            setCustomers(response.data[0]);
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
        }
    }

    const updateCustomer = async (data) => {
        // data: JSON()
        try {
            const response = await API.post(`customer`, data);
            return response.data;
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
        }
    }

    const handleUpdateSubmit = async values => {
        try {
            console.log(values.id, 'will be updated')
            const response = await API.put(`customer/${values.id}`, values);
            if (response.data.code === "EREQUEST") {
                setOpenSnackbar({open: true, variant: 'error', message: response.data.originalError.info.message})
                setUpdateDialog(false);
            }
            else {
                setOpenSnackbar({open: true, variant: 'success', message: 'Success add customer'})
                setUpdateDialog(false);
                await fetchCustomer();
            }
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
            setUpdateDialog(false);
        }
    }

    const handleSearch = async () => {
        try {
            console.log('[Query]', query)
            const response = await API.post(`customer/queries`, { query });
            if (response.data.code === "EREQUEST") {
                const message = response.data.originalError.info.message.split('.');
                setOpenSnackbar({open: true, variant: 'error', message: response.data.originalError.info.message})
            }
            else {
                setCustomers(response.data[0]);
            }
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
        }
    }


    const handleDeleteSubmit = async (event) => {
        try {
            console.log(values.id, 'will be deleted')
            const response = await API.delete(`customer/${values.id}`);
            setOpenSnackbar({open: true, variant: 'success', message: 'Success delete customer'})
            setDeleteDialog(false);
            await fetchCustomer();
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
            setDeleteDialog(false);
        }
        
    }

    const handleInsertSubmit = async (event) => {
        try {
            console.log(values.id, 'will added')
            const response = await API.post(`customer/`, values);
            if (response.data.code === "EREQUEST") {
                const message = response.data.originalError.info.message.split('.');
                setOpenSnackbar({open: true, variant: 'error', message: response.data.originalError.info.message})
                setInsertDialog(false);
            }
            else {
                setOpenSnackbar({open: true, variant: 'success', message: 'Success add customer'})
                setInsertDialog(false);
                await fetchCustomer();
            }
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
            setInsertDialog(false);
        }
        
    }


    useEffect(() => {
        console.log(customers);
    }, [customers]);

    useEffect(() => {
        console.log('FormChanged: ', formChanged);
    }, [formChanged]);
    

    useEffect(() => {
        console.log('[Customer] Did Mount.');
        fetchCustomer();
        return () => {
            console.log('[Customer] Will Unmount!');
        };
    }, []);



    const FormikUpdate = withFormik({
        validateOnMount: true,
        mapPropsToValues() {
            return values;
        },
        validationSchema: validationSchema,
        handleSubmit: (values, { setSubmitting }) => {
            handleUpdateSubmit(values);
            setSubmitting(false);
            setUpdateDialog(false);
            setFormChanged(false);
        },
    })(FormGenerator);

    const FormikInsert = withFormik({
        validateOnMount: false,
        mapPropsToValues() {
            return values;
        },
        validationSchema: validationSchema,
        handleSubmit: (values, { setSubmitting }) => {
            handleInsertSubmit(values);
            setSubmitting(false);
            setInsertDialog(false);
            setFormChanged(false);
        },
    })(FormGenerator);

    
    
    const { classes } = props;

    return (
        <React.Fragment>
            <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
                <Toolbar>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Tooltip title="Search">
                            <IconButton onClick={handleSearch}>
                                <Search className={classes.block} color="inherit" />
                            </IconButton>
                        </Tooltip>
                        
                    </Grid>
                    <Grid item xs>
                        <SearchBar 
                            fields={fields}
                            handleQuery={queryStr => setQuery(queryStr)}
                        />
                    </Grid>
                    <Grid item>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.addUser}
                        onClick={() => setInsertDrawer(true)}
                    >
                        Add Customer
                    </Button>
                    <Tooltip title="Reload">
                        <IconButton onClick={fetchCustomer}>
                            <Refresh className={classes.block} color="inherit" />
                        </IconButton>
                    </Tooltip>
                    </Grid>
                </Grid>
                </Toolbar>
            </AppBar>
            <div className={classes.contentWrapper}>
                <DynamicSnackbar
                    handleClose={() => setOpenSnackbar({...openSnackbar, open: false})}
                    {...openSnackbar}
                />
                <SwipeableDrawer
                    open={updateDrawer}
                    onClose={() => {
                        if (formChanged) 
                            setCancelDialog(true)
                        else 
                            setUpdateDrawer(false);
                    }}
                    onOpen={() => setUpdateDrawer(true)}
                >
                {
                    useMemo(() =>
                        <FormikUpdate 
                            header='Customer' 
                            description={cols} 
                            setChanged={value => setFormChanged(value)}
                            setValid={value => setFormValid(value)}
                            updateValues={vls => setValues(vls)}
                            updateDialogProps={{
                                open: updateDialog,
                                handleClose: () => setUpdateDialog(false)
                            }}
                            cancelDialogProps={{
                                open: cancelDialog,
                                handleClose: () => setCancelDialog(false),
                                handleOK: () => {
                                    setCancelDialog(false);
                                    setUpdateDrawer(false);
                                    setFormChanged(false);
                                    setValues({});
                                }
                            }}
                        />
                    , [updateDrawer, updateDialog, cancelDialog])
                }
                
                    <Grid className={classes.buttonWrapper} container justify='flex-end' alignItems='center'>
                        <Grid item xs={3}>
                            <Button 
                                className={classes.saveButton} 
                                disabled={!formChanged || !formValid}
                                variant="contained"
                                startIcon={<Save/>}
                                onClick={() => setUpdateDialog(true)}
                            > Save </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                className={classes.deleteButton} 
                                disabled={!formChanged}
                                variant="contained"
                                startIcon={<Cancel/>}
                                onClick={() => setCancelDialog(true)}
                            > Cancel </Button>
                        </Grid>
                    </Grid>
                </SwipeableDrawer>
                <SwipeableDrawer
                    open={insertDrawer}
                    onClose={() => {
                        if (formChanged) 
                            setCancelDialog(true)
                        else 
                            setInsertDrawer(false);
                    }}
                    onOpen={() => setInsertDrawer(true)}
                >
                {
                    useMemo(() =>
                        <FormikInsert
                            header='Add Customer' 
                            description={cols} 
                            setChanged={value => setFormChanged(value)}
                            setValid={value => setFormValid(value)}
                            updateValues={vls => setValues(vls)}
                            insertDialogProps={{
                                open: insertDialog,
                                handleClose: () => setInsertDialog(false)
                            }}
                            cancelDialogProps={{
                                open: cancelDialog,
                                handleClose: () => setCancelDialog(false),
                                handleOK: () => {
                                    setCancelDialog(false);
                                    setInsertDrawer(false);
                                    setFormChanged(false);
                                    setValues({});
                                }
                            }}
                        />
                    , [insertDrawer, insertDialog, cancelDialog])
                }
                    <Grid className={classes.buttonWrapper} container justify='flex-end' alignItems='center'>
                        <Grid item xs={3}>
                            <Button 
                                className={classes.saveButton} 
                                disabled={!formChanged || !formValid}
                                variant="contained"
                                startIcon={<Save/>}
                                onClick={() => setInsertDialog(true)}
                            > Save </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                className={classes.deleteButton} 
                                disabled={!formChanged}
                                variant="contained"
                                startIcon={<Cancel/>}
                                onClick={() => setCancelDialog(true)}
                            > Cancel </Button>
                        </Grid>
                    </Grid>

                </SwipeableDrawer>
                <ReactDataGrid
                    columns={cols}
                    rowGetter={i => customers[i]}
                    rowsCount={customers.length}
                    emptyRowsView={EmptyRowsView}
                    enableCellAutoFocus={false}
                    minHeight={250}
                    maxHeight={450}
                    onCellSelected={({ rowIdx }) => setValues(customers[rowIdx])} 
                />
                {
                    values.id &&
                    <Grid className={classes.actionWrapper} container spacing={2} justify="center" alignItems="center">
                        <Grid item xs={2}>
                            <Button 
                                className={classes.modifyButton} 
                                variant="contained"
                                startIcon={<Edit/>}
                                onClick={() => setUpdateDrawer(true)}
                            >
                                Modify
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                className={classes.deleteButton} 
                                variant="contained"
                                startIcon={<Delete/>}
                                onClick={() => setDeleteDialog(true)}
                            >
                                Delete
                            </Button>
                        </Grid>
                        
                    </Grid>
                }
                <ConfirmDialog
                    open={deleteDialog}
                    title='Confirm Delete'
                    content='Are you sure to delete this record?'
                    handleClose={() => setDeleteDialog(false)}
                    handleOK={handleDeleteSubmit}
                />
            </div>
        </React.Fragment>
    )
}


export default withStyles(styles)(Customer);
