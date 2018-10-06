import {Face3, Geometry, Group, Mesh, MeshBasicMaterial, Scene} from "three";
import {ajax} from "jquery";
import DataPoint from "./CHeightAPIShared";


class PatchHeightMap {
    private scene: Scene;
    private group: Group = new Group();
    private readonly material = new MeshBasicMaterial({color: 0x333333, wireframe: true});
    private readonly batchSize: number = 64;

    private patches: any = {};
    private enhancableList: [DataPoint, number][] = [];

    constructor(scene: Scene) {
        this.scene = scene;
        this.scene.add(this.group);
        this.group.rotateY(-Math.PI / 2);
        this.loadMapSubset(0, 0);
    }

    private loadNextMapSubset() {
        if (this.enhancableList.length === 0) return;
        let [point, resolution] = this.enhancableList.shift();
        this.loadMapSubset(point.lat, point.long, resolution);
    }

    private loadMapSubset(lat: number, long: number, resolution?: number) {
        if (!resolution) resolution = 0;
        ajax('', {
            contentType: 'application/vnd.api+json',
            method: 'GET',
            data: {
                lat: lat,
                long: long,
                resolution: resolution,
                'batch-size': this.batchSize
            },
            success: (msg: any) => {
                if (this.group.position.x === 0)
                    this.group.position.set(msg.meta.maxLong, 0, 0);

                // convert to DataPoint class
                let matrix: any[][] = msg.data.attributes.matrix as DataPoint[][];
                for (let y = 0; y < matrix.length; y++) {
                    matrix[y] = matrix[y].map((obj) => {return DataPoint.load(obj)});
                }
                this.addMapSubset(matrix, msg.data.attributes.resolution);
            },
            error: (jqXHR: JQuery.jqXHR, textStatus: string, errorThrown: string) => {
                debugger;
            }
        });

    }

    private addMapSubset(matrix: DataPoint[][], resolution: number): void {
        let geometry: Geometry = new Geometry();

        for (let y = 0; y < matrix.length-1; y++) {
            for (let x = 0; x < matrix[0].length-1; x++) {

                // the four points of the segment: orig, down, right, diag
                let segment: DataPoint[] = [matrix[y][x], matrix[y+1][x], matrix[y][x+1], matrix[y+1][x+1]];

                if (resolution > 1 && segment.some((point) => point.isInMap()))
                    this.enhancableList.push([matrix[y][x], resolution/Math.sqrt(this.batchSize)]);

                // check if the current segment is complete (no datapoints out of map)
                if (!segment.every((point) => point.isInMap())) continue;

                let currIdx = geometry.vertices.length;
                geometry.vertices.push(segment[0].vector3(), segment[1].vector3(), segment[2].vector3(), segment[3].vector3());
                geometry.faces.push(
                    new Face3(currIdx, currIdx+1, currIdx+3),
                    new Face3(currIdx, currIdx+3, currIdx+2)
                );
            }
        }

        geometry.computeBoundingBox();
        let mesh: Mesh = new Mesh(geometry, this.material);
        this.patches[`${resolution}-${matrix[0][0].lat}-${matrix[0][0].long}`] = mesh;
        this.group.add(mesh);

        // remove lower resolution patch that has been enhanced
        let oldKey = `${resolution*Math.sqrt(this.batchSize)}-${matrix[0][0].lat}-${matrix[0][0].long}`;
        if (oldKey in this.patches) {
            let oldMesh = this.patches[oldKey];
            this.group.remove(oldMesh);
            oldMesh.geometry.dispose();
            delete this.patches[oldKey];
        }

        this.loadNextMapSubset();
    }
}

export default PatchHeightMap;