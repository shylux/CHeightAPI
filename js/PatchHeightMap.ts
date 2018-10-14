import {Face3, Geometry, Group, Mesh, MeshBasicMaterial, Scene, Vector3, WebGLRenderer} from "three";
import {ajax} from "jquery";
import DataPoint, {HeightMapMetadata} from "./CHeightAPIShared";
import * as THREE from "three";
import { ResizeObserver } from 'resize-observer';

let DEBUG: boolean = false;

class EnhanceablePatch {
    public origin: DataPoint;
    public resolution: number;
    public onEdge: boolean;
}

export enum EnhanceStrategy {
    FIFO, // first in, first out
    MANUAL, // no automatic enhancement
    EDGE, // enhance all edges - ignore rest
    RESOLUTION_BOUND // enhance until a certain resolution is reached
}

class PatchHeightMap {
    // logic stuff
    private readonly batchSize: number = 64;
    private patches: any = {};
    private enhanceStrategy: EnhanceStrategy = EnhanceStrategy.EDGE;
    private numberOfLevelsToDisplay: number; // used in RESOLUTION_BOUND strategy
    private enhanceableList: EnhanceablePatch[] = [];
    private maxResolution: number;
    private metadata: HeightMapMetadata;

    // display stuff
    private readonly renderer: WebGLRenderer = new THREE.WebGLRenderer({alpha: true});
    private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000000);
    private readonly controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    private readonly scene: Scene = new THREE.Scene();
    private group: Group = new Group();
    private readonly material = new MeshBasicMaterial({color: 0x333333, wireframe: true});
    private container: any;

    constructor(container: any) {
        this.container = container;
        this.setupTHREE();
        this.setNumberOfLevelsToDisplay(2);
        this.loadMapSubset(0, 0);
    }

    private setupTHREE() {
        this.container.append(this.renderer.domElement);
        new ResizeObserver(this.resize.bind(this)).observe(this.container.get(0));
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

    public setEnhanceStrategy(strategy: EnhanceStrategy) {
        if (strategy === EnhanceStrategy.RESOLUTION_BOUND && !this.numberOfLevelsToDisplay)
            throw "Use setNumberOfLevelsToDisplay to set this strategy.";
        this.enhanceStrategy = strategy;
    }
    public setNumberOfLevelsToDisplay(numberOfLevelsToDisplay: number) {
        this.enhanceStrategy = EnhanceStrategy.RESOLUTION_BOUND;
        this.numberOfLevelsToDisplay = numberOfLevelsToDisplay;
    }

    private loadNextMapSubset() {
        if (this.enhanceableList.length === 0) return;

        let patch: EnhanceablePatch;
        switch (this.enhanceStrategy) {
            case EnhanceStrategy.FIFO:
                patch = this.enhanceableList.shift();
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
            setTimeout(this.loadNextMapSubset.bind(this), 5);
            return;
        }
        this.loadMapSubset(patch.origin.lat, patch.origin.long, patch.resolution);
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
                if (this.group.position.x === 0) {
                    this.metadata = msg.meta;
                    let width: number = this.metadata.maxLong - this.metadata.minLong;
                    let length: number = this.metadata.maxLat - this.metadata.minLat;
                    let max = Math.max(width, length);

                    //this.group.position.set(msg.meta.maxLong/2, 0, -msg.meta.maxLat/2);
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
                this.addMapSubset(matrix, msg.data.attributes.resolution);
            },
            error: (jqXHR: JQuery.jqXHR, textStatus: string, errorThrown: string) => {
                debugger;
            }
        });

    }

    private addMapSubset(matrix: DataPoint[][], resolution: number): void {
        let geometry: Geometry = new Geometry();

        let hasPointsInMap: boolean = matrix.some((row) => row.some((point) => point.isInMap()));

        if (hasPointsInMap) {
            for (let y = 0; y < matrix.length - 1; y++) {
                for (let x = 0; x < matrix[0].length - 1; x++) {

                    // the four points of the segment: orig, down, right, diag
                    let segment: DataPoint[] = [matrix[y][x], matrix[y + 1][x], matrix[y][x + 1], matrix[y + 1][x + 1]];

                    let segmentOnEdge: boolean = !segment.every((point) => point.isInMap());

                    if (resolution > 1)
                        this.enhanceableList.push({
                            origin: matrix[y][x],
                            resolution: resolution / Math.sqrt(this.batchSize),
                            onEdge: segmentOnEdge
                        });

                    // check if the current segment is complete (no datapoints out of map)
                    if (!segment.every((point) => point.isInMap())) continue;

                    let currIdx = geometry.vertices.length;
                    geometry.vertices.push(segment[0].vector3(), segment[1].vector3(), segment[2].vector3(), segment[3].vector3());
                    geometry.faces.push(
                        new Face3(currIdx, currIdx + 1, currIdx + 3),
                        new Face3(currIdx, currIdx + 3, currIdx + 2)
                    );
                }
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

        setTimeout(this.loadNextMapSubset.bind(this), 5);
    }
}

export default PatchHeightMap;