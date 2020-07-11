/*
 * Author: Justin Nichols
 * Class: CSC337
 * Purpose: This server provides a basic translation service.
 */

const express = require('express')
const app = express()
const host = '64.227.49.233'
const port = 80

app.use(express.static('public_html'))

app.get('/translate/:type', (req, res) => {
  res.send(req.params.type);
})

app.listen(port, () => console.log('App listening.'))
