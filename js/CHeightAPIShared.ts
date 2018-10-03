import {Vector3} from "three";

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
        //TODO: move scale to backend
        return new Vector3(this.long, this.height/1000.0, this.lat);
    }

    public isInMap(): boolean {
        return (this.height > 0);
    }
}