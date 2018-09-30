import * as express from 'express';
import {Express, Request, Response, NextFunction} from "express";
import * as fs from "fs";

class DataPoint {
    lat: number;
    long: number;
    height: number;

    constructor(lat: number, long: number, height: number) {
        this.lat = lat;
        this.long = long;
        this.height = height;
    }
}

class CHeightAPI {
    public express: Express;

    private readonly data_source_path: string = './hoehe_test.csv';
    private data: number[][];

    constructor() {
        this.express = express();

        let csv_string = this.loadCSVFile();
        this.data = this.parseCSVString(csv_string);

        this.mountRoutes();
    }

    private loadCSVFile(): string {
        process.stdout.write(`Started loading data source: ${this.data_source_path}... `);
        let csv_data: string = fs.readFileSync(this.data_source_path, 'utf8');
        process.stdout.write(`OK (${csv_data.length} bytes)\n`);
        return csv_data;
    }

    private parseCSVString(csv_string: string): number[][] {
        csv_string = csv_string.replace(/^\s+|\s+$/g, ''); // trim newlines

        let rows: string[] = csv_string.split('\n');

        let matrix: number[][] = [];
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") {
                rows.splice(i, 1);
                continue;
            }
            process.stdout.write(`\r\x1b[KParse csv data... ${(i+1)*100/rows.length}%`);
            let row: string[] = rows[i].split(',');
            matrix[i] = [];
            for (let j = 0; j < row.length; j++)
                matrix[i][j] = parseInt(row[j]);
        }

        // throw `CSV parse error: ${parse_results.errors}`;
        process.stdout.write(`\nLoaded ${matrix.length}x${matrix[0].length} Matrix\n`);
        return matrix;
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', this.handleRequest.bind(this));
        this.express.use('/', router);
    }

    private handleRequest(req: Request, res: Response, next: NextFunction): void {
        res.setHeader("Content-Type", "application/vnd.api+json");
        try {
            let lat: number, long: number, resolution: number, batchSize: number;
            [lat, long, resolution, batchSize] = this.parseRequestParameter(req);

            let batchEdgeLength: number = Math.sqrt(batchSize);
            if (batchEdgeLength % 1 !== 0) throw "batch-size has to be a power of 2.";

            if (resolution === 0) { // pick resolution, that whole map fits in
                let maxEdgeLength = Math.max(this.data.length, this.data[0].length);
                let detailLevels: number = Math.ceil(this.getBaseLog(batchEdgeLength, maxEdgeLength)) - 1;
                resolution = Math.pow(batchEdgeLength, detailLevels);
            }

            let matrix: DataPoint[][] = this.loadMapSubset(lat, long, resolution, batchEdgeLength);

            res.json({data: {
                type: 'height-data',
                id: `${resolution}-${batchSize}-${lat}-${long}`,
                attributes: {
                    resolution: resolution,
                    'batch-size': batchSize,
                    matrix: matrix
                }
            }});
        } catch(err) {
            if (typeof err === 'string') {
                res.status(400);
                res.json({
                    errors: [{'title': err}]
                });
            } else {
                res.status(500);
                res.json({
                    errors: [{
                        title: err.toString(),
                        meta: {
                            message: err.message,
                            stack: err.stack
                        }
                    }]
                });
                throw err;
            }
        }
    }

    // checks that every parameter is present
    private parseRequestParameter(req: Request): [number, number, number, number] {
        let req_params: string[] = Object.keys(req.query);

        // check if params are present
        if (!['lat', 'long', 'resolution', 'batch-size'].every(val => req_params.includes(val)))
            throw "Missing parameter. Provide 'lat', 'long', 'resolution and 'batch-size'.";

        let params_str: any[] = [req.query.lat, req.query.long, req.query.resolution, req.query['batch-size']];

        // convert params to int
        let params_int: number[] = params_str.map(val => {
            let integer = parseInt(val);
            if (isNaN(integer)) throw `All parameters have to be integers: ${val}`;
            return integer;
        });

        return params_int as [number, number, number, number];
    }

    private loadMapSubset(lat: number, long: number, resolution: number, batchEdgeLength: number): DataPoint[][] {
        let matrix: DataPoint[][] = [];
        for (let y = 0, ilat = lat; y <= batchEdgeLength; y++, ilat += resolution) {
            matrix[y] = [];
            for (let x = 0, ilong = long; x <= batchEdgeLength; x++, ilong += resolution) {
                matrix[y][x] = this.getDataPoint(ilat, ilong);
            }
        }
        return matrix;
    }

    private getDataPoint(lat: number, long: number): DataPoint {
        let height: number = -1;
        if (lat >= 0 && lat < this.data.length &&
            long >=0 && long < this.data[0].length)
            height = this.data[lat][long];
        return {
            lat: lat,
            long: long,
            height: height
        }
    }

    private getBaseLog(base: number, val: number): number {
        return Math.log(val) / Math.log(base);
    }
}


export default new CHeightAPI().express;