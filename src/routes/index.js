const express = require('express');

const router = express.Router();

require('./signin')(router);

module.exports = router;
