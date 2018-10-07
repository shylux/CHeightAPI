import HeightMapDataStore from "./HeightMapDataStore";
import * as fs from "fs";
import DataPoint from "./CHeightAPIShared";


const data_source_path: string = './hoehe_ch.csv';


async function loadFromCSV() {
    process.stdout.write(`Started loading data source file: ${data_source_path}... `);
    let csv_string: string = fs.readFileSync(data_source_path, 'utf8');
    process.stdout.write(`OK (${csv_string.length} bytes)\n`);

    csv_string = csv_string.replace(/^\s+|\s+$/g, ''); // trim newlines

    let rows: string[] = csv_string.split('\n');

    for (let i = 0; i < rows.length; i++) {
        if (rows[i] === "") continue;

        process.stdout.write(`\r\x1b[KParse csv data... [${i+1}/${rows.length}] ${(i+1)*100/rows.length}%`);
        let row: string[] = rows[i].split(',');
        let row_data: number[][] = [];
        for (let j = 0; j < row.length; j++) {
            let height = parseInt(row[j]);
            if (DataPoint.isInMap(height)) {
                row_data.push([i, j, height]);
            }
        }
        await store.storeAll(row_data);
    }

    // throw `CSV parse error: ${parse_results.errors}`;
    process.stdout.write(`\nLoaded Matrix\n`);
}


let store = new HeightMapDataStore();
store.connect().then(() => {
    console.log('connected');

    return store.resetDB();
}).then(() => {
    console.log('db reset');

    return loadFromCSV();
}).then(() => {
    console.log('Done.');
});