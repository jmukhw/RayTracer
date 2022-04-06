export { RayTracer }

import { Touple, Point, Vector } from "./Types/Touple.js";
import { Canvas } from "./Display/Canvas.js"
import * as mo from "./Operations/MatrixOps.js"
import { Color } from "./Types/Color.js";


class RayTracer {
    /**
     * Simple javascript ray tracing library
     * @param {HTMLElement} HTMLCanvas
     */
    constructor(HTMLCanvas) {
        this.canvas = new Canvas(HTMLCanvas, 0, 0, 1, true);
        this.startTime = undefined;
    }
    draw(t) {
        this.drawClock(t);
    }
    drawClock(t) {
        let elapsed = 0;
        if (this.startTime == undefined) {
            this.startTime = t;
            this.rotationOffset = 0;
        } else {
            elapsed = t - this.startTime;
            this.startTime = t;
            this.rotationOffset += (elapsed/500)
        }

        this.canvas.clearCanvas(new Color(0,0,0));
        var c = new Color(225,188,57);
        let radius = this.canvas.height/2;
        let center = new Point(this.canvas.width/2, this.canvas.height/2, 0);
        let res = 5000;
        for (let i = 0; i < res; i++) {
            let rads = (Math.PI*2)/(res/3)*i+this.rotationOffset;
            let p = new Point(0,radius/res*i,radius/(res*2)*i).Rotate_z(rads).Rotate_x(this.rotationOffset/10).Translate(center.x, center.y, center.z);
            let zcol = p.z/40;
            c.r = Math.max(50,zcol*255);
            c.g = Math.max(50,zcol*255);
            c.b = Math.max(50,zcol*255);
            this.canvas.setPixel(p.x, p.y, c);
        }
        this.canvas.update();
    }

}