import app from './app';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ Server is running at http://localhost:${port}`);
});
