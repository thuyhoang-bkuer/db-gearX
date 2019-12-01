import React from 'react';
import clsx from 'clsx';
import { Typography, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';


const styles = theme => ({
    emptyIcon: {
        fontSize: 72,
        color: 'rgba(0, 0, 0, 0.54)',
        margin: 5
    },
    typoWrapper: {
        textAlign: 'center',
        padding: '100px',
        backgroundColor: '#eee'
    },
});

const EmptyRowsView = (props) => {
    const { classes } = props;
    return (
        <div className={classes.typoWrapper}>
            <Icon className={clsx(classes.emptyIcon ,"far fa-sad-cry")}/>
            <Typography color="textSecondary" align="center">
                No Data To Show
            </Typography> 
        </div>
    );
}

export default withStyles(styles)(EmptyRowsView);