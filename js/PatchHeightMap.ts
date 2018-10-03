import {BufferAttribute, BufferGeometry, Face3, Geometry, Mesh, MeshBasicMaterial, Scene, Vector3} from "three";
import {ajax} from "jquery";
import DataPoint from "./CHeightAPIShared";


class PatchHeightMap {
    private scene: Scene;
    public mesh: Mesh;
    private geometry: BufferGeometry;
    private vertices: Float32Array;
    private vertIdx: number = 0;
    private readonly material = new MeshBasicMaterial({color: 0x333333, wireframe: true});
    private readonly batchSize: number = 16;

    private enhancableList: [DataPoint, number][] = [];

    constructor(scene: Scene) {
        this.scene = scene;
        this.loadInitialMap();
    }

    private loadInitialMap(): void {
        this.loadMapSubset(0, 0);
    }

    private loadNextMapSubset() {
        if (this.enhancableList.length === 0) return;
        let [point, resolution] = this.enhancableList.shift();
        this.loadMapSubset(point.lat, point.long, resolution);
    }

    private loadMapSubset(lat: number, long: number, resolution?: number) {
        if (!resolution) resolution = 0;
        ajax('/', {
            contentType: 'application/vnd.api+json',
            method: 'GET',
            data: {
                lat: lat,
                long: long,
                resolution: resolution,
                'batch-size': this.batchSize
            },
            success: (msg: any) => {
                this.createGeometry(msg.meta);

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

    private createGeometry(meta: any): void {
        if (this.geometry) return;
        this.geometry = new BufferGeometry();
        // length: resoluton * 2 faces per square * 3 vertices * 3 values per vertice
        this.vertices = new Float32Array(parseInt(meta.maxLat)*parseInt(meta.maxLong)*2*3*3);
        this.geometry.addAttribute( 'position', new BufferAttribute( this.vertices, 3 ) );
        this.mesh = new Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    private addMapSubset(matrix: DataPoint[][], resolution: number): void {
        for (let y = 0; y < matrix.length-1; y++) {
            for (let x = 0; x < matrix[0].length-1; x++) {

                // the four points of the segment: orig, down, right, diag
                let segment: DataPoint[] = [matrix[y][x], matrix[y+1][x], matrix[y][x+1], matrix[y+1][x+1]];

                if (resolution > 1 && segment.some((point) => point.isInMap()))
                    this.enhancableList.push([matrix[y][x], resolution/Math.sqrt(this.batchSize)]);

                // check if the current segment is complete (no datapoints out of map)
                if (!segment.every((point) => point.isInMap())) continue;

                //let idxs: number[] = segment.map(this.getVectorIndex.bind(this));

                //TODO: remove existing faces
                this.addSegment(segment);

                //this.geometry.faces.push(new Face3(idxs[0], idxs[1], idxs[3]));
                //this.geometry.faces.push(new Face3(idxs[0], idxs[3], idxs[2]));
            }
        }

        this.loadNextMapSubset();

        // if (this.vertIdx < 10000) {
        //     this.loadNextMapSubset();
        // } else {
        //     debugger;
        // }
    }

    private addSegment(segment: DataPoint[]): void {
        this.vertices[this.vertIdx] = segment[0].vector3().x;
        this.vertices[this.vertIdx+1] = segment[0].vector3().y;
        this.vertices[this.vertIdx+2] = segment[0].vector3().z;
        this.vertices[this.vertIdx+3] = segment[1].vector3().x;
        this.vertices[this.vertIdx+4] = segment[1].vector3().y;
        this.vertices[this.vertIdx+5] = segment[1].vector3().z;
        this.vertices[this.vertIdx+6] = segment[3].vector3().x;
        this.vertices[this.vertIdx+7] = segment[3].vector3().y;
        this.vertices[this.vertIdx+8] = segment[3].vector3().z;
        this.vertIdx += 9;
        this.vertices[this.vertIdx] = segment[0].vector3().x;
        this.vertices[this.vertIdx+1] = segment[0].vector3().y;
        this.vertices[this.vertIdx+2] = segment[0].vector3().z;
        this.vertices[this.vertIdx+3] = segment[3].vector3().x;
        this.vertices[this.vertIdx+4] = segment[3].vector3().y;
        this.vertices[this.vertIdx+5] = segment[3].vector3().z;
        this.vertices[this.vertIdx+6] = segment[2].vector3().x;
        this.vertices[this.vertIdx+7] = segment[2].vector3().y;
        this.vertices[this.vertIdx+8] = segment[2].vector3().z;
        this.vertIdx += 9;
        this.geometry.addAttribute( 'position', new BufferAttribute( this.vertices, 3 ) );
    }

    // private getVectorIndex(point: DataPoint): number {
    //     let vec: Vector3 = point.vector3();
    //     let index: number = this.geometry.vertices.findIndex((other) => {return vec.equals(other)});
    //     if (index !== -1)
    //         return index;
    //     else
    //         return this.geometry.vertices.push(vec) - 1;
    // }
}

export default PatchHeightMap;