import React from 'react';
import PropTypes from 'prop-types'
import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    DialogActions, 
    Button, 
    DialogContentText 
} from '@material-ui/core';

function ConfirmDialog(props) {
    const { open, title, content, handleOK, handleClose } = props;
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{title || 'Confirm'}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOK} color="primary">
                    Confirm
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancle
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ConfirmDialog.propTypes = {

}

export default ConfirmDialog;

