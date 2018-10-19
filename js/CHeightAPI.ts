import {Express, Request, Response, NextFunction} from "express";
import DataPoint, {HeightMapMetadata} from "./CHeightAPIShared";
import HeightMapDataStore from "./HeightMapDataStore";


export default class CHeightAPI {
    public express: Express;

    private readonly store = new HeightMapDataStore();
    private metadata: HeightMapMetadata;

    public async loadMap() {
        await this.store.connect();
        this.metadata = await this.store.loadMetadata();
    }

    public handleRequest(req: Request, res: Response, next: NextFunction): void {
        // only hanle jsonapi requests
        if (req.header('Content-Type') !== "application/vnd.api+json") {
            next();
            return;
        }

        res.setHeader("Content-Type", "application/vnd.api+json");
        try {
            let lat: number, long: number, resolution: number, batchSize: number;
            [lat, long, resolution, batchSize] = this.parseRequestParameter(req);

            let batchEdgeLength: number = Math.sqrt(batchSize);
            if (batchEdgeLength % 1 !== 0) throw "batch-size has to be a power of 2.";

            if (resolution === 0) { // pick resolution, that whole map fits in
                let maxEdgeLength = Math.max(this.metadata.maxLat, this.metadata.maxLong);
                let detailLevels: number = Math.ceil(CHeightAPI.getBaseLog(batchEdgeLength, maxEdgeLength)) - 1;
                resolution = Math.pow(batchEdgeLength, detailLevels);
            }

            this.loadMapSubset(lat, long, resolution, batchEdgeLength).then((data: DataPoint[][]) => {
                res.json({
                    data: {
                        type: 'height-data',
                        id: `${resolution}-${batchSize}-${lat}-${long}`,
                        attributes: {
                            resolution: resolution,
                            'batch-size': batchSize,
                            matrix: data
                        }
                    },
                    meta: {
                        maxLat: this.metadata.maxLat,
                        maxLong: this.metadata.maxLong,
                        minLat: this.metadata.minLat,
                        minLong: this.metadata.minLong
                    }
                });
            });


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

    private async loadMapSubset(lat: number, long: number, resolution: number, batchEdgeLength: number): Promise<DataPoint[][]> {
        let matrix: DataPoint[][] = [];
        for (let y = 0, ilat = lat; y <= batchEdgeLength; y++, ilat += resolution) {
            matrix[y] = [];
            for (let x = 0, ilong = long; x <= batchEdgeLength; x++, ilong += resolution) {
                matrix[y][x] = await this.getDataPoint(ilat, ilong);
            }
        }
        return matrix;
    }

    private async getDataPoint(lat: number, long: number): Promise<DataPoint> {
        let height: number = -1;
        if (lat >= this.metadata.minLat && lat <= this.metadata.maxLat &&
            long >= this.metadata.minLong && long <= this.metadata.maxLong)
            height = await this.store.get(lat, long);
        return new DataPoint(lat, long, height);
    }

    private static getBaseLog(base: number, val: number): number {
        return Math.log(val) / Math.log(base);
    }
}