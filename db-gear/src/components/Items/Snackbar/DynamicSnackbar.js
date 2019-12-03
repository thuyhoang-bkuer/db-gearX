import React from 'react'
import {
    withStyles, SnackbarContent, Snackbar, IconButton, Typography
} from '@material-ui/core'

import { Close, CheckCircle, Warning, Error, Info } from '@material-ui/icons'
import { amber, green } from '@material-ui/core/colors'

import clsx from 'clsx'

const styles = theme => ({
    snackbar: {
        maxWidth: '40%',
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
})

const variantIcon = {
    success: CheckCircle,
    warning: Warning,
    error: Error,
    info: Info,
  };


function DynamicSnackbar(props) {
    const { classes, message, variant, open, handleClose, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <Snackbar
            className={classes.snackbar}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
        >
            <SnackbarContent
                className={classes[variant]}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    <Typography align='left'>{message}</Typography>
                    </span>
                }
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                        <Close className={classes.icon} />
                    </IconButton>,
                ]}
                {...other}
            />
        </Snackbar>
    )
}

export default withStyles(styles)(DynamicSnackbar);