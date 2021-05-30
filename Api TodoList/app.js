const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
const port = 3006;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on http://localhost:${port}`);
  });
  
routes(app);