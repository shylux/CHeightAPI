import CHeightAPI from './CHeightAPI';

const port = process.env.PORT || 8080;

CHeightAPI.listen(port, (err: any) => {
    if (err) {
        return console.log(err);
    }

    return console.log(`server is listening on ${port}`);
});