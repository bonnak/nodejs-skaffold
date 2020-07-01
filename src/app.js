const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const { urlencoded, json } = require('body-parser');
const cookieSession = require('cookie-session');
const { errorHandler, NotFoundError } = require('@bonnak/toolset');

const app = express();

require('express-async-errors');

// Enable CORS
app.use(cors());

app.set('trust proxy', true);

// Security header
app.use(helmet());

// Prevent XSS attack
app.use(xss());

// Prevent Http params pollution
app.use(hpp({ whitelist: ['filter', 'include'] }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    message: {
      message: 'Too many requests, please try again later.',
    },
  }),
);

// Parse request payload
app.use(urlencoded({ extended: true }));
app.use(json());

// Cookie session
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

// Router config
app.use('/api', require('./routes'));

app.all('*', async () => {
  throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

module.exports = app;
