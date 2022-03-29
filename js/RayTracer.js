export { RayTracer }

import { Touple } from "./Types/Touple.js";
import { Point } from "./Types/Point.js"
import { Vector } from "./Types/Vector.js"


class RayTracer {
    /**
     * Simple javascript ray tracing library
     * @param {HTMLElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.tl = new Touple(20, 20);
        this.wh = new Touple(100, 100);
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.tl.x, this.tl.y, 100, 100);
        this.ctx.fillStyle = "red";
        this.ctx.fill();
    }
}