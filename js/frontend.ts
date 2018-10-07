import * as $ from "jquery";
import "./OrbitControls.js";
import PatchHeightMap from "./PatchHeightMap";

$(main);

function main() {
    const container = $('#container');

    const map = new PatchHeightMap(container);
}