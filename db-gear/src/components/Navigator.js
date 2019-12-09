import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';

import { NavLink } from 'react-router-dom';

import {
  Fingerprint, 
  People, 
  ShoppingCart, 
  CreditCard,
  Details,
  DevicesOther,
  Layers,
  AcUnit,
  AllInclusive,
  Vibration,
  Category,
  EvStation,
  HdrWeak,
  Texture
} from '@material-ui/icons'


const categories = [
  {
    id: 'Transaction',
    children: [
      { id: 'Employee', icon: <Fingerprint/>},
      { id: 'Customer', icon: <People /> },
      { id: 'Orders', icon: <ShoppingCart/> },
      { id: 'Bill', icon: <CreditCard/> },
      { id: 'Item', icon: <Details /> },
      { id: 'Product', icon: <DevicesOther /> },
    ],
  },
  {
    id: 'Product Categories',
    children: [
      { id: 'Mainboard', icon: <Layers /> },
      { id: 'VGA', icon: <Vibration /> },
      { id: 'CPU', icon: <AllInclusive /> },
      { id: 'RAM', icon: <Category /> },
      { id: 'SSD', icon: <EvStation /> },
      { id: 'HDD', icon: <HdrWeak /> },
      { id: 'Cooling', icon: <AcUnit/> },
      { id: 'Case', icon: <Texture /> }
    ],
  },
];

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

const Navigator = (props) => {
  const { classes, activeItem, itemHandler, ...other } = props;
  

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          DB GearX
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Home
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon }) => (
              <NavLink key={childId} style={{textDecoration: 'none', color: 'inherit'}} exact to={childId.toLocaleLowerCase()}>
                <ListItem
                  button
                  className={clsx(classes.item, (childId === activeItem) && classes.itemActiveItem)}
                  onClick={() => itemHandler(childId)}
                >
                  <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                    <ListItemText
                      classes={{
                        primary: classes.itemPrimary,
                      }}
                    >
                      {childId}
                    </ListItemText>
                </ListItem>
              </NavLink> 
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  itemHandler: PropTypes.func.isRequired,
  activeItem: PropTypes.string.isRequired
};

export default withStyles(styles)(Navigator);
