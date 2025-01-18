import express from 'express';
import bootstrap from './modules/app.controller';

const app: express.Application = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

bootstrap(app, express);

const port = process.env.PORT!;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
