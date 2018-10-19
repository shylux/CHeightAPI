import CHeightAPI from './CHeightAPI';
import * as express from 'express';
import {Express, Router} from "express";

const api = new CHeightAPI();

const port = process.env.PORT || 8080;

const app: Express = express();
const router: Router = express.Router();

api.loadMap().then(() => {
    router.get('/', api.handleRequest.bind(api));
    app.use('/', router);
    app.use(express.static('.'));

    app.listen(port, (err: any) => {
        if (err) {
            return console.log(err);
        }

        return console.log(`Server started on http://localhost:${port}`);
    });
});
