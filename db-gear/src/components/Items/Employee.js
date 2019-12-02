import React, { useEffect, useMemo } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Grid, Button, SwipeableDrawer } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Edit, Delete, Save, Cancel } from '@material-ui/icons';
import { withFormik } from 'formik';

import UpdateModal from './Modals/UpdateModal';
import EmptyRowsView from './EmptyRowsView';
import API from '../API';
import ConfirmDialog from './Dialogs/ConfirmDialog';



const defaultColumnConfig = {
    resizable: true,
    width: 120
}

const cols = [
    {key: "ssn", name: "SocialSecureNumber", frozen: true, type: String},
    {key: "last_name", name: "Last Name", frozen: true, type: String},
    {key: "first_name", name: "First Name", frozen: true, type: String},
    {key: "birth_date", name: "Birth", type: Date},
    {key: "sex", name: "Sex", type: ['M', 'F']},
    {key: "bank_no", name: "Bank Number", type: String},
    {key: "address", name: "Address", type: String},
    {key: "start_date", name: "Starting Date", type: Date},
    {key: "salary", name: "Salary", type: Number},
    {key: "job_type", name: "Job Type", type: ['Technician', 'Saler', 'Shipper']},
    {key: "driver_license", name: "Driver License", type: String},
    {key: "username", name: "Username", type: String},
    {key: "password", name: "Password", type: String},
    {key: "leader", name: "Leader's SSN", type: String},
].map(col => ({...col, ...defaultColumnConfig}));

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
    }
});



function Employee(props) {
    const [employees, setEmployees] = React.useState([]);
    const [selected, setSelected] = React.useState({});
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [updateDialog, setUpdateDialog] = React.useState(false);
    const [cancelDialog, setCancelDialog] = React.useState(false);
    const [formChanged, setFormChanged] = React.useState(false);

    const fetchEmployee = async () => {
        try {
            const response = await API.get(`employee`);
            setEmployees(response.data[0]);
        }
        catch (e) {
            console.error(e);
        }
    }

    const updateEmployee = async (data) => {
        // data: JSON()
        try {
            const response = await API.post(`employee`, data);
            console.log(response.data);
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        console.log(employees);
    }, [employees]);

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    useEffect(() => {
        console.log('FormChanged: ', formChanged);
    }, [formChanged]);
    

    useEffect(() => {
        console.log('[Employee] Did Mount.');
        fetchEmployee();
        return () => {
            console.log('[Employee] Will Unmount!');
        };
    }, []);

    const FormikForm = withFormik({
        mapPropsToValues() {
            return selected;
        }
    })(UpdateModal);

    
    
    const { classes } = props;

    return (
        <React.Fragment >
            <SwipeableDrawer
                open={openDrawer}
                onClose={() => {
                    if (formChanged) 
                        setCancelDialog(true)
                    else 
                        setOpenDrawer(false);
                }}
                onOpen={() => setOpenDrawer(true)}
            >
            {
                useMemo(() =>
                    <FormikForm 
                        header='Employee' 
                        description={cols} 
                        setChanged={value => setFormChanged(value)}
                    />
                , [openDrawer])
            }
                <Grid className={classes.buttonWrapper} container justify='flex-end' alignItems='center'>
                    <Grid item xs={3}>
                        <Button 
                            className={classes.saveButton} 
                            disabled={!formChanged}
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
            <ReactDataGrid
                columns={cols}
                rowGetter={i => employees[i]}
                rowsCount={employees.length}
                emptyRowsView={EmptyRowsView}
                enableCellAutoFocus={false}
                minHeight={250}
                maxHeight={450}
                onCellSelected={({ rowIdx }) => setSelected(employees[rowIdx])} 
            />
            {
                selected.ssn &&
                <Grid className={classes.actionWrapper} container spacing={2} justify="center" alignItems="center">
                    <Grid item xs={2}>
                        <Button 
                            className={classes.modifyButton} 
                            variant="contained"
                            startIcon={<Edit/>}
                            onClick={() => setOpenDrawer(true)}
                        >
                            Modify
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button 
                            className={classes.deleteButton} 
                            variant="contained"
                            startIcon={<Delete/>}
                        >
                            Delete
                        </Button>
                    </Grid>
                    
                </Grid>
            }
            <ConfirmDialog 
                open={updateDialog}
                title='Confirm Update'
                content='Are you sure updating this record?'
                handleClose={() => {
                    setUpdateDialog(false)
                }}
                handleOK={() => {
                    console.log('Updating..')
                }}
            />
            <ConfirmDialog 
                open={cancelDialog}
                title='Confirm Discard'
                content='Are you sure to discard all updates?'
                handleClose={() => {
                    setCancelDialog(false)
                }}
                handleOK={() => {
                    setCancelDialog(false)
                    setOpenDrawer(false);
                    setFormChanged(false);
                }}
            />
        </React.Fragment>
    )
}


export default withStyles(styles)(Employee);
