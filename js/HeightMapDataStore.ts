import {Database} from "sqlite3";
import DataPoint, {HeightMapMetadata} from "./CHeightAPIShared";


const DB_FILE: string = process.env.DB_FILE || './heightdata.db';
const TABLE_NAME: string = process.env.TABLE_NAME || 'heightdata';
// Indicates the resolution of the data set. The number is the amount of meters between each data point.
// In this case i have the swiss height map with a data point every 25 meters.
// Since my height values are in decimeter i have to add a x10 modifier.
const RESOLUTION: number = parseInt(process.env.RESOLUTION) || 250.0;


export default class HeightMapDataStore {
    private db: Database;

    async connect() {
        process.stdout.write(`Connecting to database ${DB_FILE} (${TABLE_NAME})...`);
        await new Promise((resolve, reject) => {
            this.db = new Database(DB_FILE, function(err) {
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
                DROP TABLE IF EXISTS ${TABLE_NAME};
                CREATE TABLE ${TABLE_NAME} (
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

        let query: string = `INSERT INTO ${TABLE_NAME} VALUES `;
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
           this.db.run(`INSERT INTO ${TABLE_NAME} VALUES ($lat, $long, $height);`, {
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
            this.db.get(`SELECT height FROM ${TABLE_NAME} WHERE lat = ${lat} AND long = ${long};`, (err, row) => {
                if (err) reject(err);
                else if (!row) resolve(-1);
                else resolve(row.height/RESOLUTION);
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
                                    FROM ${TABLE_NAME};`, (err, row) => {
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