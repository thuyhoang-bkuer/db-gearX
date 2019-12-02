const express = require('express');
const router = express.Router();

router.post('api/customer', (req, res) => {
  const {id, name, sex, address, type, username, password, points} = req.param;
});

module.exports = router;