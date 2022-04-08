export { RayTracer }

import { Touple, Point, Vector, Ray } from "./Types/Touple.js";
import { Canvas } from "./Display/Canvas.js"
import * as mo from "./Operations/MatrixOps.js"
import * as mt from "./Operations/MatrixTrans.js"
import * as int from "./Operations/Intersections.js"
import { Color } from "./Types/Color.js";
import { Sphere } from "./Types/Shapes.js";


class RayTracer {
    /**
     * Simple javascript ray tracing library
     * @param {HTMLElement} HTMLCanvas
     */
    constructor(HTMLCanvas) {
        this.canvas = new Canvas(HTMLCanvas, 0, 0, 1, true);
        this.startTime = undefined;
        this.canvas.clearCanvas(new Color(0, 0, 0));
        this.animate = true;
    }
    draw(t) {
        if (this.animate) {
            this.drawSphere(t);
            this.animate = true;
        }
    }
    drawBox(t) {
        let elapsed = 0;
        if (this.startTime == undefined) {
            this.startTime = t;
            this.rotationOffset = 0;
        } else {
            elapsed = t - this.startTime;
            this.startTime = t;
            this.rotationOffset += (elapsed / 500)
        }
        this.canvas.clearCanvas(new Color(0, 0, 0));
        let center = new Point(this.canvas.width / 2, this.canvas.height / 2, 0);
        var c = new Color(225, 188, 57);
        let p = [];
        let s = 100;
        p[0] = new Point(-1, -1, -1);
        p[1] = new Point(1, -1, -1);
        p[2] = new Point(-1, 1, -1);
        p[3] = new Point(1, 1, -1);
        p[4] = new Point(-1, -1, 1);
        p[5] = new Point(1, -1, 1);
        p[6] = new Point(-1, 1, 1);
        p[7] = new Point(1, 1, 1);


        for (let i = 0; i < p.length; i++) {
            p[i] = p[i].Scale(s, s, s).Rotate_z(this.rotationOffset / 5).Rotate_y(this.rotationOffset / 30).Translate(center.x, center.y, center.z);
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

        p[0] = new Point(-1, -1, -1);
        p[1] = new Point(1, -1, -1);
        p[2] = new Point(-1, 1, -1);
        p[3] = new Point(1, 1, -1);
        p[4] = new Point(-1, -1, 1);
        p[5] = new Point(1, -1, 1);
        p[6] = new Point(-1, 1, 1);
        p[7] = new Point(1, 1, 1);
        for (let i = 0; i < p.length; i++) {
            p[i] = p[i].Scale(s / 2, s / 2, s / 2).Rotate_y(this.rotationOffset / 5).Rotate_x(this.rotationOffset / 3).Translate(center.x / 2, center.y / 2, -100);
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
            this.rotationOffset += (elapsed / 500)
        }

        this.canvas.clearCanvas(new Color(0, 0, 0));
        var c = new Color(225, 188, 57);
        let radius = this.canvas.height / 2;
        let center = new Point(this.canvas.width / 2, this.canvas.height / 2, 0);
        let res = 5000;
        for (let i = 0; i < res; i++) {
            let rads = (Math.PI * 2) / (res / 3) * i + this.rotationOffset;
            let p = new Point(0, radius / res * i, radius / (res * 2) * i).Rotate_z(rads).Rotate_x(this.rotationOffset / 10).Translate(center.x, center.y, center.z);
            let zcol = p.z / 100;
            c.r = Math.max(50, zcol * 255);
            c.g = Math.max(50, zcol * 255);
            c.b = Math.max(50, zcol * 255);
            this.canvas.setPixelRect(p.x, p.y, 5, 5, c);
        }
        this.canvas.update();
    }
    drawSphere(t) {
        //let m = mt.Translation(0, 0, Math.sin(t / 5000) * 1.5).Rotate_x(t / 1000).Shear(1.5, 0, 0, 0, 0, 0).Scale(2, 2, 2);
        let m = mt.Rotation_x(t/1000).Shear(1.5, 0,0,0,0,0).Scale(2,2,2);
        //let m = mo.Get4x4IdentityMatrix().Scale(2,2,2).Shear(.4, 0,0,0,0,0);
        let s = new Sphere(m);

        let o = new Point(0, 0, -5);
        let d = new Vector(0, 0, 1);
        let dmag = 1;

        let n = 75;
        let fov = (120 / 360) * 2 * Math.PI;

        let w = 2;
        let h = 2;

        let bgColor = new Color(12, 14, 25);
        let sphereColor = new Color(67, 160, 75);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let c = bgColor;
                let xrot = (fov / n) * (i - n / 2);
                let yrot = (fov / n) * (j - n / 2);

                let passes = 1;
                let range = .005;

                for (let k = 0; k < passes; k++) {
                    let r = new Ray(o.Add(new Vector((Math.random()+Math.random() - 1) * range, (Math.random()+Math.random() - 1) * range, (Math.random()+Math.random() - 1) * range)), d.Rotate_x(xrot).Rotate_y(yrot));
                    let intersections = r.Intersect(s);

                    let hit = int.Hit(intersections);
                    if (hit != undefined) {
                        let r2 = r.Transform(s.transform);
                        let depth = Math.floor(this.canvas.remap(hit.t/mo.Magnitude(r2.d), -200,200,0,3.5));
                        c = new Color((c.r*passes+(sphereColor.r-depth))/passes, 
                        (c.g*passes+(sphereColor.g-depth))/passes, 
                        (c.b*passes+(sphereColor.b-depth))/passes);
                    }
                }

                this.canvas.setPixelRect(i * w, j * h, w, h, c);
            }
        }
        this.canvas.update();

    }


}