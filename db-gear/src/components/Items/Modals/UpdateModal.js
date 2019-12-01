import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { 
    Grid, 
    FormControl, 
    Typography,
    Input,
    InputLabel, 
} from '@material-ui/core';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker 
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';


const styles = theme => ({
    updateDrawer: {
        width: '400px',
        padding: '40px',
        backgroundColor: '#fff'
    },
    headerDrawer: {
        fontSize: 32,
        color: '#03a9fc'
    }
});

// const header = 'Employee';   
// const description = [
//     {key: 'ssn', name: 'Social Secure Numbre', type: Number},
//     {key: 'birth', name: 'Birth', type: Date}
// ];
// const data = {
//     ssn: '1234',
//     birth: '1999-11-07'
// }

function UpdateModal(props) {
    /**
     * description: [
     *      {key, name, type},
     *      ...
     * ],
     * data: {
     *      key: value,
     *      ...
     * }
     */
    const { classes, header, description, data } = props; 
    
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
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                id={key}
                                label={name}
                                value={data[key]}
                                // onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </FormControl>
                        :
                        <FormControl fullWidth margin='normal'>
                            <InputLabel>{name}</InputLabel>
                            <Input name={key} value={data[key] || ''} fullWidth />
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

