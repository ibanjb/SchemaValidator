import app from './app';

const port = 3000;
app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});
