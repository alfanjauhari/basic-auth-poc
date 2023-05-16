const express = require('express');
const cors = require('cors');
const basicAuth = require('basic-auth');

const app = express();

const user = {
  username: 'admin',
  password: 'admin',
};

function basicAuthMiddleware(req, res, next) {
  const credentials = basicAuth(req);

  if (!credentials) {
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    return res.status(401).send('Access Denied');
  }

  // Check if credentials are present and correct
  if (
    credentials.name === user.username &&
    credentials.pass === user.password
  ) {
    // Authentication successful, proceed to the next middleware or route handler
    next();
  } else {
    // Authentication failed, send '401 Unauthorized' response
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    res.sendStatus(401).send('Access Denied');
  }
}

app.use(
  cors({
    origin: '*',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  })
);

app.get('/', basicAuthMiddleware, (_, res) => {
  res.send({
    success: true,
    message: 'Hello World',
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
