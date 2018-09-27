import * as express from 'express';
import {Express} from "express";
import * as fs from "fs";

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
        router.get('/', (req, res) => {
           res.json({message: "Hello World"});
        });
        this.express.use('/', router);
    }
}

export default new CHeightAPI().express;