export { RayTracer }

import { Touple } from "./Types/Touple.js";
import { Point } from "./Types/Point.js"
import { Vector } from "./Types/Vector.js"
import { Canvas } from "./Display/Canvas.js"
import * as mo from "./Operations/MatrixOps.js"
import { Color } from "./Types/Color.js";


class RayTracer {
    /**
     * Simple javascript ray tracing library
     * @param {HTMLElement} HTMLCanvas
     */
    constructor(HTMLCanvas) {
        this.canvas = new Canvas(HTMLCanvas, 0, 0, 10, true);
    }
    draw() {
        var c = new Color(225,188,57);
        this.canvas.setPixel(1,2, c);
    }

}