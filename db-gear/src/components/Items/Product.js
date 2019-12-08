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



const defaultColumnConfig = {
    resizable: true,
    width: 120
}

const cols = [
    {key: "prod_id", name: "Product id", frozen: true, type: String},
    {key: "cost", name: "Product cost", frozen: true, type: String},
    {key: "producer", name: "Producer", frozen: true, type: Int},
    {key: "prod_type", name: "Product type", type: String},
    {key: "remain", name: "Product remain", type: Int}
].map(col => ({...col, ...defaultColumnConfig}));

const validationSchema = Yup.object().shape({
    prod_id: Yup.string().required('Product id is required').length(7, 'prod_id must have 7 digits').matches(/[0-9]{7}/, 'Invalid prod_id'),
    cost: Yup.Int().required('Cost is required'),
    producer: Yup.string().required('Producer is required'),
    prod_type: Yup.string().required('Product Type is required'),
    remain: Yup.Int().required('Remain is required'),
});

// const rows = [
//     {
//         "ssn": "000000001",
//         "first_name": "Thuy",
//         "last_name": "Hoang Vu Trong",
//         "birth_date": "1999-11-07T00:00:00.000Z",
//         "sex": "M",
//         "bank_no": "9704480857466233",
//         "address": "53 TKX, 7th, Phu Nhuan, HCM City",
//         "start_date": "2019-01-09T00:00:00.000Z",
//         "salary": 450,
//         "job_type": "Technician",
//         "driver_license": null,
//         "username": null,
//         "password": null,
//         "leader": null
//     }
// ];

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
    },
        searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        display: 'block',
    },
    addUser: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px 16px',
    },
});



function Product(props) {
    const [product, setProduct]       = React.useState([]);
    const [values, setValues]             = React.useState({});
    const [updateDrawer, setUpdateDrawer] = React.useState(false);
    const [insertDrawer, setInsertDrawer] = React.useState(false);
    const [deleteDialog, setDeleteDialog] = React.useState(false);
    const [updateDialog, setUpdateDialog] = React.useState(false);
    const [insertDialog, setInsertDialog] = React.useState(false);
    const [cancelDialog, setCancelDialog] = React.useState(false);
    const [formChanged, setFormChanged]   = React.useState(false);
    const [formValid, setFormValid]       = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState({open: false, variant: 'success', message: 'Hello, world'});

    const fetchProduct = async () => {
        try {
            const response = await API.get(`product`);
            setProduct(response.data[0]);
        }
        catch (e) {
            
        }
    }

    const updateProduct = async (data) => {
        // data: JSON()
        try {
            const response = await API.post(`product`, data);
            return response.data;
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
        }
    }

    const handleUpdateSubmit = values => {
        const message = updateProduct(values);
        console.log(message)
    }


    const handleDeleteSubmit = async (event) => {
        try {
            console.log(values.prod_id, 'will be deleted')
            const response = await API.delete(`employee/${values.ssn}`);
            setOpenSnackbar({open: true, variant: 'success', message: 'Success delete product'})
            setDeleteDialog(false);
            await fetchProduct();
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
            setDeleteDialog(false);
        }
        
    }

    const handleInsertSubmit = async (event) => {
        try {
            console.log(values.ssn, 'will added')
            const response = await API.post(`product/`, values);
            if (response.data.code === "EREQUEST") {
                const message = response.data.originalError.info.message.split('.');
                setOpenSnackbar({open: true, variant: 'error', message: response.data.originalError.info.message})
                setInsertDialog(false);
            }
            else {
                setOpenSnackbar({open: true, variant: 'success', message: 'Success add product'})
                setInsertDialog(false);
                await fetchProduct();
            }
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
            setInsertDialog(false);
        }
        
    }


    useEffect(() => {
        console.log(employees);
    }, [employees]);

    useEffect(() => {
        console.log('FormChanged: ', formChanged);
    }, [formChanged]);
    

    useEffect(() => {
        console.log('[Product] Did Mount.');
        fetchProduct();
        return () => {
            console.log('[Product] Will Unmount!');
        };
    }, []);



    const FormikUpdate = withFormik({
        validateOnMount: true,
        mapPropsToValues() {
            return values;
        },
        validationSchema: validationSchema,
        handleSubmit: (values, { setSubmitting }) => {
            // handleInsertSubmit(values);
            setSubmitting(false);
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
                    <Search className={classes.block} color="inherit" />
                    </Grid>
                    <Grid item xs>
                    <TextField
                        fullWidth
                        placeholder="Searching.."
                        InputProps={{
                        disableUnderline: true,
                        className: classes.searchInput,
                        }}
                    />
                    </Grid>
                    <Grid item>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.addUser}
                        onClick={() => setInsertDrawer(true)}
                    >
                        Add Employee
                    </Button>
                    <Tooltip title="Reload">
                        <IconButton>
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
                            header='Product' 
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
                            header='Add Product' 
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
                    rowGetter={i => product[i]}
                    rowsCount={product.length}
                    emptyRowsView={EmptyRowsView}
                    enableCellAutoFocus={false}
                    minHeight={250}
                    maxHeight={450}
                    onCellSelected={({ rowIdx }) => setValues(product[rowIdx])} 
                />
                {
                    values.prod_id &&
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


export default withStyles(styles)(Employee);
