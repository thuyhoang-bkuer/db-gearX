import React, { useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import EmptyRowsView from './EmptyRowsView';
import API from '../API';
import { Grid, Button, SwipeableDrawer } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Edit, Delete } from '@material-ui/icons';
import UpdateModal from './Modals/UpdateModal';


const defaultColumnConfig = {
    resizable: true,
    width: 120
}

const cols = [
    {key: "ssn", name: "SocialSecureNumber", frozen: true, type: String},
    {key: "last_name", name: "Last Name", frozen: true, type: String},
    {key: "first_name", name: "First Name", frozen: true, type: String},
    {key: "birth_date", name: "Birth", type: Date},
    {key: "sex", name: "Sex", type: Array('M', 'F')},
    {key: "bank_no", name: "Bank Number", type: String},
    {key: "address", name: "Address", type: String},
    {key: "start_date", name: "Starting Date", type: Date},
    {key: "salary", name: "Salary", type: Number},
    {key: "job_type", name: "Job Type", type: String},
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

    const handleSelect = event => {
        const { rowIdx } = event;
        setSelected(employees[rowIdx]);
    }


    useEffect(() => {
        console.log(employees);
    }, [employees]);

    useEffect(() => {
        console.log(selected);
    }, [selected]);
    

    useEffect(() => {
        console.log('[Employee] Did Mount.');
        fetchEmployee();
        return () => {
            console.log('[Employee] Will Unmount!');
        };
    }, []);

    const { classes } = props;

    return (
        <React.Fragment >
            <SwipeableDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
            >
                <UpdateModal header='Employee' description={cols} data={selected}/>
            </SwipeableDrawer>
            <ReactDataGrid
                columns={cols}
                rowGetter={i => employees[i]}
                rowsCount={employees.length}
                emptyRowsView={EmptyRowsView}
                enableCellAutoFocus={false}
                minHeight={250}
                maxHeight={450}
                onCellSelected={event => handleSelect(event)} 
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
        </React.Fragment>
    )
}


export default withStyles(styles)(Employee);
