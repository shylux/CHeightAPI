import {
    Face3, Frustum,
    Geometry,
    Group,
    Intersection, Matrix4,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer
} from "three";
import {ajax} from "jquery";
import DataPoint, {HeightMapMetadata} from "./CHeightAPIShared";
import * as THREE from "three";
import { ResizeObserver } from 'resize-observer';

let DEBUG: boolean = false;

class EnhanceablePatch {
    public origin: DataPoint;
    public resolution: number;
    public onEdge: boolean;
    public parentGeometry: Geometry;
    public parentFacesIdx: number[];
}

export enum EnhanceStrategy {
    AUTO, // select next patch based on a formula (looking at, low res)
    MANUAL, // no automatic enhancement
    EDGE, // enhance all edges - ignore rest
    RESOLUTION_BOUND // enhance until a certain resolution is reached
}

class PatchHeightMap {
    // logic stuff
    private readonly batchSize: number = 64;
    private enhanceStrategy: EnhanceStrategy = EnhanceStrategy.EDGE;
    private numberOfLevelsToDisplay: number; // used in RESOLUTION_BOUND strategy
    private enhanceableList: EnhanceablePatch[] = [];
    private maxResolution: number;
    private metadata: HeightMapMetadata;
    private maxWorkerCount: number = 1;
    private workerCount: number = 0;

    // display stuff
    private readonly renderer: WebGLRenderer = new THREE.WebGLRenderer({alpha: true});
    private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000000);
    private readonly controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    private readonly raycaster = new THREE.Raycaster();
    private readonly scene: Scene = new THREE.Scene();
    private group: Group = new Group();
    private readonly material = new MeshBasicMaterial({color: 0x333333, wireframe: true});
    private container: any;

    constructor(container: any) {
        this.container = container;
        this.setupTHREE();
        this.setNumberOfLevelsToDisplay(2);
        this.loadMapSubset();
    }

    private setupTHREE() {
        this.container.append(this.renderer.domElement);
        new ResizeObserver(this.resize.bind(this)).observe(this.container.get(0));
        this.container.on('click', this.click.bind(this));
        this.renderer.setSize(this.container.width(), this.container.height());
        this.renderer.setClearColor(0x000000, 0.5);
        this.scene.add(this.camera);
        this.scene.add(this.group);

        requestAnimationFrame(this.redraw.bind(this));
    }

    private resize() {
        this.renderer.setSize(this.container.width(), this.container.height());
        this.camera.aspect = parseFloat(this.container.width()) / this.container.height();
        this.camera.updateProjectionMatrix();
    }

    private redraw() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.redraw.bind(this));
    }

    private click(event: MouseEvent) {
        let offset: any = this.container.offset();
        let mouse: Vector2 = new Vector2();
        // black magic by https://threejs.org/examples/canvas_interactive_cubes.html
        mouse.setX(( (event.clientX-offset.left) / this.renderer.domElement.clientWidth ) * 2 - 1);
        mouse.setY(-( (event.clientY-offset.top) / this.renderer.domElement.clientHeight ) * 2 + 1);

        this.raycaster.setFromCamera(mouse, this.camera);
        let intersects: Intersection[] = this.raycaster.intersectObjects(this.group.children);
        if (intersects.length > 0) {
            let target: Mesh = intersects[0].object as Mesh;
            for (let patch of this.enhanceableList) {
                if (patch.parentGeometry === target.geometry) this.loadMapSubset(patch);
            }
        }
    }

    public setEnhanceStrategy(strategy: EnhanceStrategy) {
        if (strategy === EnhanceStrategy.RESOLUTION_BOUND && !this.numberOfLevelsToDisplay)
            throw "Use setNumberOfLevelsToDisplay to set this strategy.";
        this.enhanceStrategy = strategy;
        this.queueNextSubset();
    }
    public setNumberOfLevelsToDisplay(numberOfLevelsToDisplay: number) {
        this.enhanceStrategy = EnhanceStrategy.RESOLUTION_BOUND;
        this.numberOfLevelsToDisplay = numberOfLevelsToDisplay;
    }

    private queueNextSubset() {
        setTimeout(this.loadNextMapSubset.bind(this), 5);
    }

    private loadNextMapSubset() {
        if (this.workerCount >= this.maxWorkerCount ||
            (this.enhanceableList.length === 0 && this.workerCount > 0)) return;

        let patch: EnhanceablePatch;
        switch (this.enhanceStrategy) {
            case EnhanceStrategy.AUTO:
                let frustum: Frustum = new Frustum();
                this.camera.updateMatrix();
                this.camera.updateMatrixWorld(true);
                this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
                frustum.setFromMatrix(new Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

                let point: Vector3;
                this.raycaster.setFromCamera(new Vector2(0, 0), this.camera);
                let intersects: Intersection[] = this.raycaster.intersectObjects(this.group.children);
                if (intersects.length > 0) {
                    let target: Mesh = intersects[0].object as Mesh;
                    point = (target.geometry as Geometry).vertices[0];
                }

                let bestScore: number = Number.MAX_SAFE_INTEGER;
                for (let entry of this.enhanceableList) {
                    if (!frustum.containsPoint(entry.origin.vector3())) continue;
                    if (point) {
                        //let score = Math.abs(point.x - entry.origin.vector3().x) + Math.abs(point.z - entry.origin.vector3().z);
                        let score = Number.MAX_SAFE_INTEGER - entry.resolution;
                        if (score < bestScore) {
                            bestScore = score;
                            patch = entry;
                        }
                    }
                }
                this.enhanceableList.splice(this.enhanceableList.indexOf(patch), 1);
                break;
            case EnhanceStrategy.RESOLUTION_BOUND:
                let edgeSize = Math.sqrt(this.batchSize);
                let res = this.maxResolution / (edgeSize**(this.numberOfLevelsToDisplay-1));
                for (let entry of this.enhanceableList) {
                    if (entry.resolution >= res) {
                        patch = entry;
                        this.enhanceableList.splice(this.enhanceableList.indexOf(entry), 1);
                        break;
                    }
                }
                break;
            case EnhanceStrategy.EDGE:
                for (let entry of this.enhanceableList) {
                    if (entry.onEdge) {
                        patch = entry;
                        this.enhanceableList.splice(this.enhanceableList.indexOf(entry), 1);
                        break;
                    }
                }
                break;
            case EnhanceStrategy.MANUAL:
            default:
                break;
        }
        if (!patch) {
            this.queueNextSubset();
            return;
        }
        this.loadMapSubset(patch);
        this.workerCount++;
        // spawn new worker when the max is not reached
        if (this.workerCount < this.maxWorkerCount) this.queueNextSubset();
    }

    private loadMapSubset(patch?: EnhanceablePatch) {
        let resolution: number = 0, lat: number = 0, long: number = 0;
        if (patch) {
            resolution = patch.resolution;
            lat = patch.origin.lat;
            long = patch.origin.long;
        }
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
                if (this.group.position.x === 0) {
                    // set initial camera position
                    this.metadata = msg.meta;
                    let width: number = this.metadata.maxLong - this.metadata.minLong;
                    let length: number = this.metadata.maxLat - this.metadata.minLat;
                    let max = Math.max(width, length);

                    this.group.position.set(this.metadata.maxLat-length/2, 0, -this.metadata.maxLong+width/2);
                    this.group.rotateY(-Math.PI / 2);
                    this.camera.position.set(0, max/1.5, -max/2);
                    if (DEBUG) {
                        let geometry: Geometry = new Geometry();
                        geometry.vertices.push(new Vector3(this.metadata.minLong, 0, this.metadata.minLat));
                        geometry.vertices.push(new Vector3(this.metadata.maxLong, 0, this.metadata.minLat));
                        geometry.vertices.push(new Vector3(this.metadata.minLong, 0, this.metadata.maxLat));
                        geometry.vertices.push(new Vector3(this.metadata.maxLong, 0, this.metadata.maxLat));
                        geometry.faces.push(new Face3(0, 1, 3), new Face3(0, 3, 2));
                        geometry.computeBoundingBox();
                        let mesh: Mesh = new Mesh(geometry, this.material);
                        this.group.add(mesh);
                    }
                }

                if (!this.maxResolution)
                    this.maxResolution = msg.data.attributes.resolution;

                // convert to DataPoint class
                let matrix: any[][] = msg.data.attributes.matrix as DataPoint[][];
                for (let y = 0; y < matrix.length; y++) {
                    matrix[y] = matrix[y].map((obj) => {return DataPoint.load(obj)});
                }
                this.addMapSubset(patch, matrix, msg.data.attributes.resolution);
            },
            error: (jqXHR: JQuery.jqXHR, textStatus: string, errorThrown: string) => {
                this.workerCount--;
                debugger;
            }
        });

    }

    private addMapSubset(patch: EnhanceablePatch, matrix: DataPoint[][], resolution: number): void {
        let geometry: Geometry = new Geometry();

        let hasPointsInMap: boolean = matrix.some((row) => row.some((point) => point.isInMap()));

        if (hasPointsInMap || this.group.children.length <= 1) {
            for (let y = 0; y < matrix.length - 1; y++) {
                for (let x = 0; x < matrix[0].length - 1; x++) {

                    // the four points of the segment: orig, down, right, diag
                    let segment: DataPoint[] = [matrix[y][x], matrix[y + 1][x], matrix[y][x + 1], matrix[y + 1][x + 1]];

                    let pointsInMap: number = segment.filter((point) => point.isInMap()).length;

                    // check if the current segment is complete (no datapoints out of map)
                    let facesIdx: number[] = [];
                    if (pointsInMap === 4) {
                        let currIdx = geometry.vertices.length;
                        geometry.vertices.push(segment[0].vector3(), segment[1].vector3(), segment[2].vector3(), segment[3].vector3());
                        let length = geometry.faces.push(
                            new Face3(currIdx, currIdx + 1, currIdx + 3),
                            new Face3(currIdx, currIdx + 3, currIdx + 2)
                        );
                        facesIdx = [length-2, length-1];
                    }

                    // add segment to enhancable list
                    if (resolution > 1)
                        this.enhanceableList.push({
                            origin: matrix[y][x],
                            resolution: resolution / Math.sqrt(this.batchSize),
                            onEdge: pointsInMap < 4,
                            parentGeometry: geometry,
                            parentFacesIdx: facesIdx
                        });
                }
            }
        }

        geometry.computeBoundingBox();
        let mesh: Mesh = new Mesh(geometry, this.material);
        mesh.updateMatrix();
        mesh.updateMatrixWorld(true);
        this.group.add(mesh);

        if (patch) {
            for (let idx of patch.parentFacesIdx)
                patch.parentGeometry.faces[idx] = new Face3(0, 0, 0);
            if (patch.parentFacesIdx.length > 0)
                patch.parentGeometry.elementsNeedUpdate = true;
            //TODO: dispose mesh when fully replaced
        }

        // finish worker and queue next
        this.workerCount--;
        this.queueNextSubset();
    }
}

export default PatchHeightMap;