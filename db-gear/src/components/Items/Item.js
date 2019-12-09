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
    IconButton,
    Typography,
    Drawer
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
    width: 150
}

const itemCols = [
    {key: "order_id", name: "Order ID", frozen: true, type: String, lock: true},
    {key: "name", name: "Display Name", type: String, lock: true},
    {key: "price", name: "Price", type: Number},
    {key: "quantity", name: "Quantity", type: String},
    {key: "prod_id", name: "Product ID", type: String},
    {key: "producer", name: "Producer", type: String, lock: true},
    {key: "cost", name: "Cost", type: String, lock: true},
    {key: "description", name: "Discription", type: String}
].map(col => ({...col, ...defaultColumnConfig}));

const itemInsert = [
    {key: "order_id", name: "Order ID", frozen: true, type: String, lock: true},
    {key: "name", name: "Display Name", type: String},
    {key: "price", name: "Price", type: Number},
    {key: "quantity", name: "Quantity", type: String},
    {key: "prod_id", name: "Product ID", type: String},
    {key: "description", name: "Discription", type: String}
];

const fields = itemCols.map(({key, name}) => ({id: key, text: name}));

const validationSchema = Yup.object().shape({
    order_id: Yup.string().length(12, 'OrderID must have 12 chars').required('OrderID must be required'),
    name: Yup.string().required('Name is required'),
    price: Yup.number().min(0, 'Price must be greater than 0').required('Price is required'),
    quantity: Yup.number().min(0, 'Quantity must be greater than 0').required('Quantity is required'),
    prod_id: Yup.string().required('ProductID is required').length(7, 'CustomerID must have 7 chars'),
    description: Yup.string().nullable()
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
    addOrder: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px 16px',
    },
    contentExpanded: {
        margin: '10px 16px 16px',
    },
    whiteBg: {
        backgroundColor: 'white',
    }
});



function Item({ init, classes }) {
    const [items, setItems]             = React.useState([]);
    const [values, setValues]             = React.useState(init);
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

    const fetchItems = async () => {
        try {
            const response = await API.get(init ? `orders/${init.order_id}/items` : `items`);
            setItems(response.data[0]);
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
        }
    }


    const handleUpdateSubmit = async values => {
        try {
            console.log(values.order_id, 'will be updated')
            const response = await API.put(`item/`, values);
            if (response.data.code === "EREQUEST") {
                setOpenSnackbar({open: true, variant: 'error', message: response.data.originalError.info.message})
                setUpdateDialog(false);
            }
            else {
                setOpenSnackbar({open: true, variant: 'success', message: 'Success adding an order.'})
                setUpdateDialog(false);
                await fetchItems();
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
            const response = await API.post(`item/queries/${init.order_id}`, { query });
            if (response.data.code === "EREQUEST") {
                const message = response.data.originalError.info.message.split('.');
                setOpenSnackbar({open: true, variant: 'error', message: response.data.originalError.info.message})
            }
            else {
                setItems(response.data[0]);
            }
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
        }
    }


    const handleDeleteSubmit = async (event) => {
        try {
            console.log(values.order_id, 'will be deleted')
            const response = await API.delete(`item/oid=${values.order_id}&name=${values.name.replace(' ','-')}`);
            setOpenSnackbar({open: true, variant: 'success', message: 'Success delete an order'})
            setDeleteDialog(false);
            setValues({});
            await fetchItems();
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
            setDeleteDialog(false);
        }
        
    }

    const handleInsertSubmit = async (event) => {
        try {
            console.log('will added')

            const response = await API.post(`item/`, values);
            if (response.data.code === "EREQUEST") {
                const message = response.data.originalError.info.message.split('.');
                setOpenSnackbar({open: true, variant: 'error', message: response.data.originalError.info.message})
                setInsertDialog(false);
            }
            else {
                setOpenSnackbar({open: true, variant: 'success', message: 'Success Add Item'})
                setInsertDialog(false);
                await fetchItems();
            }
        }
        catch (e) {
            setOpenSnackbar({open: true, variant: 'error', message: 'An error occurs'})
            setInsertDialog(false);
        }
        
    }

    useEffect(() => {
        fetchItems();
    }, [init]);

    useEffect(() => {
        console.log(items);
    }, [items]);

    useEffect(() => {
        console.log('FormChanged: ', formChanged);
    }, [formChanged]);
    

    useEffect(() => {
        console.log('[Order] Did Mount.');
        fetchItems();
        return () => {
            console.log('[Order] Will Unmount!');
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
                        className={classes.addOrder}
                        onClick={() => setInsertDrawer(true)}
                    >
                        Add Item
                    </Button>
                    <Tooltip title="Reload">
                        <IconButton onClick={fetchItems}>
                            <Refresh className={classes.block} color="inherit" />
                        </IconButton>
                    </Tooltip>
                    </Grid>
                </Grid>
                </Toolbar>
            </AppBar>
            <DynamicSnackbar
                handleClose={() => setOpenSnackbar({...openSnackbar, open: false})}
                {...openSnackbar}
            />
            <Drawer
                classes={{
                    paper: classes.whiteBg,
                }}
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
                        header={'Update Order'}
                        description={itemCols} 
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
            </Drawer>
            <Drawer
                classes={{
                    paper: classes.whiteBg,
                }}
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
                        header={'Add Item'}
                        description={itemInsert} 
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

            </Drawer>
            <ConfirmDialog
                open={deleteDialog}
                title='Confirm Delete'
                content='Are you sure to delete this record?'
                handleClose={() => setDeleteDialog(false)}
                handleOK={handleDeleteSubmit}
            />
            <div className={classes.contentWrapper}>
                <ReactDataGrid
                    columns={itemCols}
                    rowGetter={i => items[i]}
                    rowsCount={items.length}
                    emptyRowsView={EmptyRowsView}
                    enableCellAutoFocus={false}
                    minHeight={250}
                    maxHeight={450}
                    onCellSelected={({ rowIdx }) => setValues(items[rowIdx])} 
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
            </div>
        </React.Fragment>
    )
}


export default withStyles(styles)(Item);
