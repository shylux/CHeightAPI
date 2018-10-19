import {Vector3} from "three";


export class HeightMapMetadata {
    minLat: number;
    maxLat: number;
    minLong: number;
    maxLong: number;
    minHeight: number;
    maxHeight: number;
}

export default class DataPoint {
    lat: number;
    long: number;
    height: number;

    constructor(lat: number, long: number, height: number) {
        this.lat = lat;
        this.long = long;
        this.height = height;
    }

    public static load(obj: any): DataPoint {
        return new DataPoint(obj.lat, obj.long, obj.height);
    }

    public equals(other: DataPoint) {
        return (this.lat === other.lat &&
            this.long === other.long &&
            this.height === other.height);
    }

    public vector3(): Vector3 {
        return new Vector3(this.long, this.height, this.lat);
    }

    public isInMap(): boolean {
        return DataPoint.isInMap(this.height);
    }

    public static isInMap(height: number) {
        return (height !== -1);
    }
}