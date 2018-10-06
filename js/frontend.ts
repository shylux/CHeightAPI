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

    camera.position.set(0, 400, -400);


    function update () {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}