import * as $ from "jquery";
import * as THREE from "three";
import "./OrbitControls.js";
import PatchHeightMap from "./PatchHeightMap";

$(document).ready(main);

function main() {
    const container = $('#container');



    // Set the scene size.
    const WIDTH = container.width();
    const HEIGHT = container.height();

    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 100000;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    container.append(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(camera);

    const map = new PatchHeightMap(scene);

    // add sphere
    const material = new THREE.MeshBasicMaterial({color: 0x333333, wireframe: true});

    // light
    const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight);


    function update () {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    console.log('Done.');

    loadHeightData();

    function loadHeightData() {
        $.ajax({
            url: "hoehe_test.csv",
            dataType: "text",
            success: function(data) {
                data = data.split('\n');
                for (let i = 0; i < data.length; i++) {
                    if (data[i] === "") {
                        data.splice(i, 1);
                        continue;
                    }
                    data[i] = data[i].split(',');
                    for (let j = 0; j < data[i].length; j++)
                        data[i][j] = parseInt(data[i][j]);
                }
                displayHeightMap(data);
            }
        });
    }

    function displayHeightMap(data: number[][]) {
        let geometry = new THREE.PlaneGeometry(data.length, data[0].length, data.length, data[0].length);
        let plane = new THREE.Mesh(geometry, material);
        for (let x = 0; x < data.length; x++) {
            for (let y = 0; y < data[0].length; y++) {
                (plane.geometry as any).vertices[x * data[0].length + y].z = data[x][y]/1000.0;
            }
        }
        plane.rotation.x = -Math.PI / 2;
        camera.position.set(0, data.length, -data.length);
        //scene.add(plane);
    }


}