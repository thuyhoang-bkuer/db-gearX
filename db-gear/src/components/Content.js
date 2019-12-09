import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import { Employee, Product, Orders, Customer } from './Items';
import { BrowserRouter as Router, Route } from "react-router-dom";

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
        <Route path='/employee'>
          <Employee/>
        </Route>
        <Route path='/customer'>
          <Customer/>
        </Route>
        <Route path='/product'>
          <Product/>
        </Route>
        <Route path='/orders'>
          <Orders/>
        </Route>
      </Paper>

  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
