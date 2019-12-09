import React from 'react';
import PropTypes from 'prop-types';
import { 
    withStyles,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    Button,
    DialogActions 
} from '@material-ui/core'

const style = theme => ({
    reportWrapper: {
        minWidth: '400px',
    }
});


function ReportDialog(props) {
    const { classes, open, handleOK, handleClose, fields, data } = props;
    return (
        <Dialog
            classes={{
                paper: classes.reportWrapper
            }}
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Report Order</DialogTitle>
            <DialogContent>
            {
                fields.map(({key, name}) => (
                    <DialogContentText key={key}>
                        {`${name}: ${data[key]}`}
                    </DialogContentText>
                ))
            }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOK} color="primary">
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ReportDialog.propTypes = {
    fields: PropTypes.array,
};

export default withStyles(style)(ReportDialog);
