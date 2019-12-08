import React, { useEffect } from 'react';
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
    FormHelperText, 
} from '@material-ui/core';

import _ from 'lodash';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker 
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';
import ConfirmDialog from '../Dialogs/ConfirmDialog';


const styles = theme => ({
    updateDrawer: {
        width: '400px',
        padding: '40px 40px 20px',
        backgroundColor: '#fff',
    },
    insertDrawer: {
        width: '400px',
        padding: '40px 40px 20px',
        backgroundColor: '#50adfa'
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

function FormGenerator(props) {

    const { 
        classes,
        header,
        description,
        values,
        errors,
        submitForm,
        updateValues,
        setChanged,
        setValid,
        setFieldValue,
        handleSubmit,
        insertDialogProps,
        updateDialogProps,
        cancelDialogProps
    } = props; 

    useEffect(() => {
        setValid(_.size(errors) === 0)
    }, [errors])

    return (
        <Grid className={classes.updateDrawer} container justify='center' alignItems='center'>
            {
                insertDialogProps &&
                <ConfirmDialog 
                    title='Confirm Addition'
                    content='Are you sure to add this record?'
                    handleOK={() => {
                        handleSubmit(values);
                    }}
                    {...insertDialogProps}
                />
            }
            {
                updateDialogProps &&
                <ConfirmDialog 
                    title='Confirm Update'
                    content='Are you sure updating this record?'
                    handleOK={() => {
                        submitForm();
                    }}
                    {...updateDialogProps}
                />
            }
            <ConfirmDialog 
                title='Confirm Discard'
                content='Are you sure to discard all updates?'
                {...cancelDialogProps}
            />
            <Grid item xs={12}>
                <Typography className={classes.headerDrawer} justify='center' gutterBottom>
                    {header}
                </Typography>
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {
                description.map(({key, name, type, lock}) => (
                    <Grid key={key} item xs={12}>
                    {
                        type === Date 
                        ?
                        <FormControl fullWidth margin='normal' error={!!errors[key]}>
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
                                    updateValues({...values, [key]: value})
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                
                            />
                            <FormHelperText>{errors[key]}</FormHelperText>
                        </FormControl>
                        :
                        type === String || type === Number
                        ?
                        <FormControl fullWidth margin='normal' error={!!errors[key]}>
                            <InputLabel>{name}</InputLabel>
                            <Input 
                                name={key} 
                                value={values[key] || ''} 
                                fullWidth 
                                disabled={updateDialogProps && lock === true}
                                onChange={event => {
                                    setChanged(true);
                                    setFieldValue(key, event.target.value);
                                    updateValues({...values, [key]: event.target.value})
                                }}
                            />
                            <FormHelperText>{errors[key]}</FormHelperText>
                        </FormControl>
                        :
                        <FormControl fullWidth margin='normal' error={!!errors[key]}>
                            <InputLabel id={key}>{name}</InputLabel>
                            <Select
                                disabled={updateDialogProps && lock === true}
                                labelId={`${key}-label`}
                                id={key}
                                name={key}
                                value={values[key]}
                                onChange={event => {
                                    setChanged(true);
                                    setFieldValue(key, event.target.value);
                                    updateValues({...values, [key]: event.target.value})
                                }}
                            >
                            { type.map((value, id) => <MenuItem key={id} value={value}>{value}</MenuItem>) }
                            </Select>
                            <FormHelperText>{errors[key]}</FormHelperText>
                        </FormControl>
                    }
                    </Grid>
                ))
            }
            </MuiPickersUtilsProvider>
        </Grid>
    )
}


export default  withStyles(styles)(FormGenerator);

