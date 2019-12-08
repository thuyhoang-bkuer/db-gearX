import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import { Employee, Product, Orders } from './Items';


const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  
});

function Content(props) {
  const { classes, activeItem } = props;

  return (
    <Paper className={classes.paper}>
<<<<<<< HEAD
      <Orders />
=======
      <Product />
>>>>>>> origin/Dang
    </Paper>
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
