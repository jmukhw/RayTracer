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
        this.drawBox(t);
    }
    drawBox(t) {
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
        let center = new Point(this.canvas.width/2, this.canvas.height/2, 0);
        var c = new Color(225,188,57);
        let p = [];
        let s = 100;
        p[0] = new Point(-1,-1,-1);
        p[1] = new Point(1,-1,-1);
        p[2] = new Point(-1,1,-1);
        p[3] = new Point(1,1,-1);
        p[4] = new Point(-1,-1,1);
        p[5] = new Point(1,-1,1);
        p[6] = new Point(-1,1,1);
        p[7] = new Point(1,1,1);

        
        for (let i = 0; i < p.length; i++) {
            p[i] = p[i].Scale(s,s,s).Rotate_z(this.rotationOffset/5).Rotate_y(this.rotationOffset/30).Translate(center.x, center.y, center.z);
        }
        this.canvas.drawLine(p[0], p[1]);
        this.canvas.drawLine(p[0], p[2]);
        this.canvas.drawLine(p[0], p[4]);
        this.canvas.drawLine(p[1], p[3]);
        this.canvas.drawLine(p[1], p[5]);
        this.canvas.drawLine(p[2], p[3]);
        this.canvas.drawLine(p[2], p[6]);
        this.canvas.drawLine(p[3], p[7]);
        this.canvas.drawLine(p[4], p[5]);
        this.canvas.drawLine(p[4], p[6]);
        this.canvas.drawLine(p[5], p[7]);
        this.canvas.drawLine(p[6], p[7]);


        this.canvas.update();

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
            let zcol = p.z/100;
            c.r = Math.max(50,zcol*255);
            c.g = Math.max(50,zcol*255);
            c.b = Math.max(50,zcol*255);
            this.canvas.setPixelRect(p.x, p.y, 5, 5, c);
        }
        this.canvas.update();
    }


}