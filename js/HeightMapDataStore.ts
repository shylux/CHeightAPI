import {Database} from "sqlite3";
import DataPoint, {HeightMapMetadata} from "./CHeightAPIShared";


export default class HeightMapDataStore {
    private readonly db_file: string = './heightdata.db';
    private readonly db_data_table_name: string = 'heightdata';
    private db: Database;

    async connect() {
        process.stdout.write(`Connecting to database...`);
        await new Promise((resolve, reject) => {
            this.db = new Database(this.db_file, function(err) {
                if (err) {
                    process.stdout.write(` FAILED\n`);
                    reject(err);
                } else {
                    process.stdout.write(` OK\n`);
                    resolve();
                }
            });
        });
    }

    private checkConnected() {
        if (!this.db) throw "Database not connected.";
    }

    async resetDB() {
        this.checkConnected();

        await new Promise((resolve, reject) => {
            this.db.exec(`
                DROP TABLE IF EXISTS ${this.db_data_table_name};
                CREATE TABLE ${this.db_data_table_name} (
                    lat INTEGER,
                    long INTEGER,
                    height INTEGER,
                    PRIMARY KEY (lat, long)
                );`,
                (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                })
        });
    }

    async storeAll(rawPoints: number[][]) {
        this.checkConnected();

        if (rawPoints.length === 0) return;

        let query: string = `INSERT INTO ${this.db_data_table_name} VALUES `;
        let query_parts = [];
        for (let i = 0; i < rawPoints.length; i++) {
            query_parts[i] = `(${rawPoints[i][0]}, ${rawPoints[i][1]}, ${rawPoints[i][2]})`;
        }
        query += query_parts.join(', ') + ';';
        await new Promise((resolve, reject) => {
            this.db.run(query, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async store(point: DataPoint) {
        this.checkConnected();

        await new Promise((resolve, reject) => {
           this.db.run(`INSERT INTO ${this.db_data_table_name} VALUES ($lat, $long, $height);`, {
               $lat: point.lat,
               $long: point.long,
               $height: point.height
           }, (err) => {
              if (err)
                  reject(err);
              else
                  resolve();
           });
        });
    }

    async get(lat: number, long: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.db.get(`SELECT height FROM ${this.db_data_table_name} WHERE lat = ${lat} AND long = ${long};`, (err, row) => {
                if (err) reject(err);
                else if (!row) resolve(-1);
                else resolve(row.height);
            });
        });
    }

    private metadata: HeightMapMetadata;
    async loadMetadata(): Promise<HeightMapMetadata> {
        return new Promise<HeightMapMetadata>((resolve, reject) => {
            if (this.metadata) {
                resolve(this.metadata);
                return;
            }
            process.stdout.write(`Loading map metadata...`);
            this.db.get(`SELECT MIN(lat) as minLat,
                                    MAX(lat) as maxLat,
                                    MIN(long) as minLong,
                                    MAX(long) as maxLong,
                                    MIN(height) as minHeight,
                                    MAX(height) as maxHeight
                                    FROM ${this.db_data_table_name};`, (err, row) => {
                if (err) {
                    process.stdout.write(` FAILED\n`);
                    reject(err);
                } else {
                    this.metadata = row;
                    process.stdout.write(` OK\n`);
                    resolve(this.metadata);
                }
            });
        });
    }
}