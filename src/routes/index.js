const express = require('express');

const router = express.Router();

require('./signin')(router);
require('./signout')(router);

module.exports = router;
