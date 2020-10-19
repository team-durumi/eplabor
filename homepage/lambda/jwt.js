'use strict';
const jwt = require('jsonwebtoken');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('GET!!');
  res.json({ 'message': 'test' });
})
router.post('/', (req, res) => {
  try {
    const privateKey = process.env.PK.split('_').join("\n");
    const token = jwt.sign({"sub": "mozodev", "name": "mozodev"}, privateKey, { algorithm: 'RS256'});
    res.json({ token });
  } catch (e) {
    res.status(500);
    res.send('Failed generate jwt token.');
    console.error(e.message);
  }
});
app.use(bodyParser.json());
app.use('/.netlify/functions/jwt', router);

module.exports = app;
module.exports.handler = serverless(app);