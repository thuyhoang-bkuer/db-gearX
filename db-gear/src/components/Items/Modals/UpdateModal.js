import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { 
    Grid, 
    FormControl, 
    Typography,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Button, 
} from '@material-ui/core';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker 
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';
import { Save, Cancel } from '@material-ui/icons';
import ConfirmDialog from '../Dialogs/ConfirmDialog';


const styles = theme => ({
    updateDrawer: {
        width: '400px',
        padding: '40px 40px 20px',
        backgroundColor: '#fff'
    },
    headerDrawer: {
        fontSize: 32,
        color: '#03a9fc'
    },
    buttonWrapper: {
        paddingTop: '20px'
    },
    saveButton: {
        backgroundColor: '#1fed78',
        color: '#fff',
        padding: '5px 10px',
        '&:hover,&:focus': {
            backgroundColor: '#14b86e',
        }
    },
    cancelButton: {
        backgroundColor: '#fc1758',
        color: '#fff',
        padding: '5px 10px',
        '&:hover': {
            backgroundColor: '#ba0f50',
        }
    },
});

// const header = 'Employee';   
// const description = [
//     {key: 'ssn', name: 'Social Secure Numbre', type: Number},
//     {key: 'birth', name: 'Birth', type: Date}
// ];
// const values = {
//     ssn: '1234',
//     birth: '1999-11-07'
// }


/**
 * description: [
 *      {key, name, type},
 *      ...
 * ],
 * values: {
 *      key: value,
 *      ...
 * }
 */

/**
 * type: 
 *      String 
 *      Number
 *      Date
 *      Array[option]
 */

function UpdateModal(props) {

    const { classes, header, description, values, setChanged, setFieldValue } = props; 

    return (
        <Grid className={classes.updateDrawer} container justify='center' alignItems='center'>
            <Grid item xs={12}>
                <Typography className={classes.headerDrawer} justify='center' gutterBottom>
                    {header}
                </Typography>
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {
                description.map(({key, name, type}) => (
                    <Grid key={key} item xs={12}>
                    {
                        type === Date 
                        ?
                        <FormControl fullWidth margin='normal'>
                            <KeyboardDatePicker
                                disableToolbar
                                autoOk
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                id={key}
                                name={key}
                                label={name}
                                value={values[key]}
                                onChange={value => {
                                    setChanged(true);
                                    setFieldValue(key, value);
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                
                            />
                        </FormControl>
                        :
                        type === String || type === Number
                        ?
                        <FormControl fullWidth margin='normal'>
                            <InputLabel>{name}</InputLabel>
                            <Input 
                                name={key} 
                                value={values[key] || ''} 
                                fullWidth 
                                onChange={event => {
                                    setChanged(true);
                                    setFieldValue(key, event.target.value);
                                }}
                            />
                        </FormControl>
                        :
                        <FormControl fullWidth margin='normal'>
                            <InputLabel id={key}>{name}</InputLabel>
                            <Select
                                labelId={`${key}-label`}
                                id={key}
                                name={key}
                                value={values[key]}
                                onChange={event => {
                                    setChanged(true);
                                    setFieldValue(key, event.target.value);
                                }}
                            >
                            { type.map((value, id) => <MenuItem key={id} value={value}>{value}</MenuItem>) }
                            </Select>
                        </FormControl>
                    }
                    </Grid>
                ))
            }
            </MuiPickersUtilsProvider>
        </Grid>
    )
}

UpdateModal.propTypes = {

}

export default withStyles(styles)(UpdateModal);

