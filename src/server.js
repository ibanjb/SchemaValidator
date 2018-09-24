import app from './app';

const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('./src/config/server.ini');
const port = properties.get('server.port');

app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});
