import express from 'express';
import bodyParser from 'body-parser';
import deckRouter from './controllers/deck';
import cardRouter from './controllers/card';

const app: express.Application = express();

app.use(bodyParser.json());

app.use('/card', cardRouter);
app.use('/deck', deckRouter);

process.on('uncaughtException', (e) => {
    console.log('uncaughtException', e);
    process.exit(1);
});

process.on('unhandledRejection', (e) => {
    console.log('unhandledRejection', e);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.end(err?.message);
});

app.listen(3000, () => {
    console.log('Server started');
});
