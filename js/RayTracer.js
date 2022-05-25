export { RayTracer }

import { Touple, Point, Vector, Ray, World } from "./Types/Touple.js";
import { Canvas } from "./Display/Canvas.js"
import * as mo from "./Operations/MatrixOps.js"
import * as mt from "./Operations/MatrixTrans.js"
import * as int from "./Operations/Intersections.js"
import * as so from "./Operations/ShapeOps.js"
import { Color } from "./Types/Color.js";
import { Material, PointLight, Sphere, Camera, Plane, Cube, PatternStriped, PatternGradient, PatternRing, PatternChecker, PatternBlended, GlassSphere, Cylinder } from "./Types/Shapes.js";
import { Ziggurat } from "./Operations/GaussianOps.js"


class RayTracer {
    /**
     * Simple javascript ray tracing library
     * @param {HTMLElement} HTMLCanvas
     */
    constructor(HTMLCanvas) {
        this.canvas = new Canvas(HTMLCanvas, 0, 0, 1, true);
        this.startTime = undefined;
        this.canvas.clearCanvas(new Color(0, 0, 0));
        let z = new Ziggurat();
        this.rnd = z.nextGaussian;
        this.animate = true;
        let t = this;
        let i = 0;
        this.frameTimeMS = 100;
        //t.drawSpherePhongShaded(i++);
        /*
        setInterval(() => {
            t.drawSpherePhongShaded(i++);
        },1000);
        */
        for (i = 0; i < 8; i += .1) {
            t.drawCameraScene8(i);
        }

    }
    drawCameraScene8(t) {
        let pixel_scale = 4;


        let m = new Material(new Color(.43, .43, .31), .1, .3, .4, 1000);
        m.transparency = .95;
        m.reflective = .6;
        m.refractive_index = .6;

        let groundMat = new Material(new Color(0, 0, 0), 0, .6, .1, 3);
        groundMat.pattern = new PatternGradient(new Color(.8, .85, .8), new Color(.9, .95, .9));
        groundMat.pattern = new PatternBlended(new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6)),
            new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6), mt.Rotation_y(Math.PI / 3)));
        groundMat.reflective = .2;
        let plane = new Plane(mt.Translation(0, -1, 0), groundMat);
        let c = new Cylinder(mt.Translation(0, 2, 0).Scale(2, 2, 2).Rotate_y(Math.PI / 4 * t).Rotate_z(Math.PI / 1.9), m, 0, .25, true);
        let c2 = new Cylinder(mt.Translation(-6, 2, -5).Scale(2, 2, 2).Rotate_y(Math.PI / 8 * t).Rotate_z(Math.PI / 1.9), m, 0, 1, true);
        let light = new PointLight(new Color(1, 1, 1).MultipleScalar(2), new Point(3, 4, -3));
        let w = new World(plane, c, c2, light);


        let camera = new Camera(150, 150, Math.PI / 2);
        //let from = new Point(Math.cos(Math.PI / 8 * t) * 6, 3, Math.sin(Math.PI / 8 * t) * 6);
        let from = new Point(Math.cos(Math.PI / 8) * 6, 3, Math.sin(Math.PI / 8) * 6);
        let to = new Point(0, 2, 0);
        let up = new Vector(0, 1, 0);
        camera.transform = mt.ViewTransform(from, to, up);
        camera.Render(w);

        this.RenderCameraCanvas(camera, pixel_scale);


    }
    drawCameraScene7(t) {
        let pixel_scale = 1;

        let width = 500;
        let height = 500;

        let maxWorkers = Math.pow(6, 2);
        this.remainingWorkers = maxWorkers;
        let rt = this;

        let camera = new Camera(width, height, undefined);

        for (let i = 0; i < maxWorkers; i++) {
            let worker = new Worker('./js/RenderCameraCanvasParallel.js', { type: "module" });

            worker.postMessage([width, height, i, maxWorkers]);
            worker.onmessage = function (e) {
                camera.canvas = e.data;
                rt.RenderCameraCanvas(camera, pixel_scale, i, maxWorkers);
                rt.remainingWorkers--;
                if (rt.remainingWorkers == 0) rt.canvas.saveFrame();
                rt.canvas.update();
            }

        }

    }
    drawCameraScene6(t) {
        let pixel_scale = 5;

        let groundMat = new Material(new Color(0, 0, 0), 0, .6, .1, 3);
        groundMat.pattern = new PatternGradient(new Color(.8, .85, .8), new Color(.9, .95, .9));
        groundMat.pattern = new PatternBlended(new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6)),
            new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6), mt.Rotation_y(Math.PI / 3)));
        groundMat.reflective = .3;

        let walls = [
            new Plane(mt.Translation(0, 10, 0), new Material(new Color(1, 1, 1), .05, .8, .1, 1, new PatternChecker(new Color(1, 1, 1), new Color(.8, .8, .8), mt.Scaling(.01, .01, .01)))),
            new Plane(mt.Translation(-10, 0, 0).Rotate_z(Math.PI / 2), new Material(new Color(1, 1, 1), .05, .8, .1, 1, new PatternRing(new Color(1, 1, 1), new Color(.8, .8, .8), mt.Scaling(3, 3, 3)))),
            new Plane(mt.Translation(0, 0, 10).Rotate_x(Math.PI / 2), new Material(new Color(1, 1, 1), .05, .8, .1, 1, new PatternStriped(new Color(1, .8, .8), new Color(.8, .6, .6), mt.Scaling(3, 3, 3)))),
            new Plane(mt.Translation(10, 0, 0).Rotate_z(Math.PI / 2), new Material(new Color(1, 1, 1), .05, .8, .1, 1, new PatternStriped(new Color(.8, 1, .8), new Color(.6, .8, .6), mt.Scaling(3, 3, 3)))),
            new Plane(mt.Translation(0, 0, -10).Rotate_x(Math.PI / 2), new Material(new Color(1, 1, 1), .05, .8, .1, 1, new PatternStriped(new Color(.8, 1, .8), new Color(.6, .6, .8), mt.Scaling(3, 3, 3)))),
            new Plane(mt.Translation(0, -1, 0), groundMat)
        ]

        let m = new Material(new Color(.43, .43, .31), .01, .1, .4, 300);
        m.transparency = .9;
        m.reflective = 1.1;
        m.refractive_index = 2.5;

        let s = new Sphere(mt.Translation(0, 2, 0).Scale(2, 2, 2), m);
        let s2 = new Sphere(mt.Translation(7, 1, 3).Scale(2, 2, 2), m);
        let s3 = new Sphere(mt.Translation(-4, 0, 3).Scale(1, 3, 1),
            new Material(new Color(1, 1, .23), .1, .6, .6, 100,
                new PatternRing(new Color(1, 1, .23), new Color(.23, .23, 1)), .3, .4, .7));

        let light = new PointLight(new Color(1, 1, 1).MultipleScalar(2), new Point(5, 9, -3));
        let w = new World(s, s2, s3, light, ...walls);


        let camera = new Camera(10, 10, Math.PI / 2);
        let from = new Point(Math.cos(2 * Math.PI * t) * 6, 4, Math.sin(2 * Math.PI * t) * 4);
        let to = new Point(0, 2, 0);
        let up = new Vector(0, 1, 0);
        camera.transform = mt.ViewTransform(from, to, up);
        //camera.Render(w);


        let worker = new Worker('./js/RenderCameraCanvasParallel.js', { type: "module" });

        worker.postMessage([0, 4]);

        let rt = this;
        worker.onmessage = function (e) {
            console.log("response from worker");
            console.log(e.data);
            camera.canvas = e.data;
            rt.RenderCameraCanvas(camera, pixel_scale);
        }
    }
    drawCameraScene5(t) {
        let pixel_scale = 5;


        let m = new Material(new Color(.43, .43, .31), .01, .1, .4, 300);
        m.transparency = .9;
        m.reflective = 1.1;
        m.refractive_index = t;

        let groundMat = new Material(new Color(0, 0, 0), 0, .6, .1, 3);
        groundMat.pattern = new PatternGradient(new Color(.8, .85, .8), new Color(.9, .95, .9));
        groundMat.pattern = new PatternBlended(new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6)),
            new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6), mt.Rotation_y(Math.PI / 3)));
        groundMat.reflective = .9;
        let plane = new Plane(mt.Translation(0, -1, 0), groundMat);
        let s = new Sphere(mt.Translation(0, 2, 0).Scale(2, 2, 2), m);
        let light = new PointLight(new Color(1, 1, 1).MultipleScalar(2), new Point(5, 10, -3));
        let w = new World(plane, s, light);


        let camera = new Camera(100, 100, Math.PI / 2);
        let from = new Point(0, 4.1, -2);
        let to = new Point(0, 2, 0);
        let up = new Vector(0, 1, 0);
        camera.transform = mt.ViewTransform(from, to, up);
        camera.Render(w);

        this.RenderCameraCanvas(camera, pixel_scale);

    }
    drawCameraScene4(t) {
        let pixel_scale = 1;


        let m = new Material(new Color(.97, .87, .23), .1, .3, .3, 10);
        m.transparency = .9;
        m.reflective = .9;
        m.refractive_index = 1.5;

        let m2 = new Material(new Color(1, 1, 1), .01, 0, 0, 100);
        m2.transparency = .7;
        m2.reflective = 1;
        m2.refractive_index = .7;

        let m3 = new Material(new Color(1, 1, 1), .01, 0, 0, 100);
        m3.transparency = 1;
        m3.reflective = .9;
        m3.refractive_index = 2.5;

        let groundMat = new Material(new Color(0, 0, 0), .15, .8, 0, 0);
        groundMat.pattern = new PatternGradient(new Color(.8, .85, .8), new Color(.9, .95, .9));
        groundMat.pattern = new PatternBlended(new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6)),
            new PatternStriped(new Color(.9, .95, .9), new Color(.6, .65, .6), mt.Rotation_y(Math.PI / 3)));
        groundMat.reflective = .4;
        let plane = new Plane(mt.Translation(0, -1, 0), groundMat);
        let s = new Sphere(mt.Translation(0, 1, 0).Scale(2, 2, 2), m);
        let s3 = new Sphere(mt.Translation(8, 1, 8).Scale(2, 2, 2), new Material());
        let s2 = new Sphere(mt.Translation(0, 1, -5.9).Scale(1, 1, .1), m2);
        let s4 = new Sphere(mt.Translation(0, 1, -4 - (t / 10)).Scale(1, 1, .1), m3);
        let light = new PointLight(new Color(1, 1, 1).MultipleScalar(2), new Point(0, 10, 0));
        let w = new World(plane, s, s2, s3, s4, light);


        let camera = new Camera(500, 500, Math.PI / 2);
        let from = new Point(0, 1, -6);
        let to = new Point(0, 0, 0);
        let up = new Vector(0, 1, 0);
        camera.transform = mt.ViewTransform(from, to, up);
        camera.Render(w);

        this.RenderCameraCanvas(camera, pixel_scale);

    }
    drawCameraScene3(t) {
        let pixel_scale = 1;

        let groundMat = new Material(new Color(.77, .74, .75), .02, .4, .0, 1000);
        groundMat.reflective = .4;
        let plane = new Plane(mt.Translation(0, -1, 0), groundMat);
        let light = new PointLight(new Color(2.7, 2.68, 2.69), new Point(0, 3, -1));
        //let m = new Material(new Color(1, 1, 1), .3, .01, .01, 3);
        let m = new Material(new Color(1, 1, 1), .07, .4, .6, 1000);
        m.reflective = .7;
        m.pattern = new PatternBlended(
            new PatternRing(new Color(.3, .7, .45), new Color(.4, .85, .5), mt.Scaling(.1, .2, .1)),
            new PatternStriped(new Color(.1, .25, .05), new Color(.7, .8, .5), mt.Scaling(.1, .2, .25)));
        groundMat.pattern = new PatternChecker(new Color(.85, .95, .85), new Color(.9, .98, .9), mt.Scaling(2, 2, 2));;
        let s = new Sphere(mt.Translation(-2, 0, 0).Rotate_y(t * Math.PI / 10).Scale(2, 2, 2), m);
        let s2 = new Sphere(mt.Translation(2, 1, -1), new Material(new Color(1, 1, 1), .01, .4, .4, 100, new PatternGradient(new Color(1, .1, .1), new Color(.8, 1, .9)), .6));

        let w = new World(s, s2, plane, light);

        let camera = new Camera(1000, 1000, Math.PI / 2);
        let from = new Point(0, 3, -3);
        let to = new Point(0, 0, 0);
        let up = new Vector(0, 1, 0);
        camera.transform = mt.ViewTransform(from, to, up);
        camera.RenderWithApeture(w, 15, this.rnd);

        this.RenderCameraCanvas(camera, pixel_scale);

    }
    drawCameraScene2(t) {
        let pixel_scale = 4;
        let spheres = [new Sphere(mt.Translation(0, 1, -1), new Material(new Color(.8, .2, .1), .05, .4, .6, 50, new PatternGradient(new Color(1, .1, .1), new Color(.8, 1, .9)), .6)),
        new Sphere(mt.Translation(0, 2, 3).Rotate_y((t / 2) * Math.PI / 4).Rotate_x((t / 2) * Math.PI / 4).Scale(2.5, 1, .5), new Material(new Color(.8, .9, .1), .05, .4, .6, 50, new PatternChecker(new Color(.2, .7, .7), new Color(.5, 1, 1), mt.Translation(.5, 0, 0)), .75)),
        new Sphere(mt.Translation(-3, 1, 2), new Material(new Color(.8, .2, .9), .05, .4, .6, 50, new PatternStriped(new Color(.7, .2, .3), new Color(1, .5, .6), mt.Scaling(.25, 1, 1)), .4))];

        let groundMat = new Material(new Color(.47, .4, .45), .2, .2, .05, 3, new PatternChecker(new Color(.05, .3, .1), new Color(.1, .4, .2)), .4);
        let wallMat = new Material(new Color(.7, .75, .85), .02, .25, .1, 3, new PatternStriped(new Color(.2, .7, .3), new Color(.5, 1, .6)), .6);
        let planes = [new Plane(mt.Translation(0, -1, 0), groundMat),
        new Plane(mt.Translation(0, 0, 10).Rotate_x(Math.PI * 3 / 2), wallMat),
        new Plane(mt.Translation(5, 0, 0).Rotate_z(Math.PI / 2), wallMat)];
        let lights = [new PointLight(new Color(.7, .68, .69).MultipleScalar(0), new Point(0, 400, 1)),
        new PointLight(new Color(.7, .68, .69).MultipleScalar(1), new Point(-2, 0, -2)),
        new PointLight(new Color(.7, .68, .69).MultipleScalar(.5), new Point(2, .5, -1))];

        let w = new World(...spheres, ...planes, ...lights);

        let camera = new Camera(50, 50, Math.PI / 2);
        let from = new Point(0, 3, -3);
        let to = new Point(0, 0, 0);
        let up = new Vector(0, 1, 0);
        camera.transform = mt.ViewTransform(from, to, up);
        camera.RenderWithApeture(w, 1, this.rnd);

        this.RenderCameraCanvas(camera, pixel_scale);

    }
    drawCameraScene1(t) {
        let pixel_scale = 1;
        let s1 = new Sphere(mt.Scaling(2, 2, 2).Translate(-1, -1, 1), new Material(new Color(.8, .2, .1), .1, .4, .6, 50))
        let s5 = new Sphere(mt.Scaling(2, 1, 1.5).Translate(1.5, -3, 2), new Material(new Color(.1, .8, .6), .1, .5, .3, 8))
        let s6 = new Sphere(mt.Scaling(1, 1, 1).Translate(0, -3, 0).Rotate_z(t / 10).Shear(.3, 0.2, 0.3, .1, .1, .1), new Material(new Color(.4, .8, .9), .1, .9, .1, 1))
        let s2 = new Sphere(mt.Scaling(50, 50, 1).Translate(0, 0, 10), new Material(new Color(.8, .7, .89), .3, .4, .1, 1))
        let s3 = new Sphere(mt.Scaling(50, 1, 50).Translate(0, -5, 0), new Material(new Color(.3, .2, .3), .3, .4, .1, 1))
        let s4 = new Sphere(mt.Scaling(1, 50, 50).Translate(-7, 0, 0), new Material(new Color(.8, .7, .89), .3, .4, .1, 1))
        let light = new PointLight(new Color(.68, .69, .69), new Point(1, 1, 1));
        let light2 = new PointLight(new Color(.68, .69, .69), new Point(Math.sin(t / 5) * 6, 1, Math.cos(t / 5) * 6));
        let w = new World(s1, s2, s3, s4, s5, s6, light, light2);
        let camera = new Camera(400, 400, Math.PI / 2);
        let from = new Point(0, 0, -3);
        let to = new Point(0, -1, 0);
        let up = new Vector(0, 1, 0);
        camera.transform = mt.ViewTransform(from, to, up);
        camera.RenderWithApeture(w, 10, this.rnd);

        this.RenderCameraCanvas(camera, pixel_scale);

    }

    draw(t) {
        if (this.startTime == undefined) this.startTime = t;
        if (t - this.startTime < this.frameTimeMS) {
            return;
        }
        this.startTime = t;
        if (this.animate) {
            this.canvas.nextFrame();
            this.canvas.displayCurrentFrame();
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
        let ray_origin = new Point(0, 0, -5);
        let wall_z = 10;
        let wall_size = 7;
        let canvas_pixels = 100;
        let pixel_scale = 2;
        let pixel_size = wall_size / canvas_pixels;
        let half = wall_size / 2;
        this.canvas.startNewFrame();
        let color = new Color(255, 82, 32);
        let bgcolor = new Color(33, 115, 115);
        this.canvas.setPixelRect(0, 0, canvas_pixels * pixel_scale, canvas_pixels * pixel_scale, bgcolor);

        let shape = new Sphere(mt.Rotation_z(Math.PI * t / 30).Scale(.25, 1, 1));

        for (let y = 0; y < canvas_pixels; y++) {
            let world_y = half - pixel_size * y;
            for (let x = 0; x < canvas_pixels; x++) {
                let world_x = half - pixel_size * x;
                let position = new Point(world_x, world_y, wall_z);
                let r = new Ray(ray_origin, mo.Normalize(position.Subtract(ray_origin)));
                let xs = int.Intersect(r, shape);
                let hit = int.Hit(xs);
                if (hit != undefined) {
                    this.canvas.setPixelRect(x * pixel_scale, y * pixel_scale, pixel_scale, pixel_scale, color);
                }
            }
        }
        this.canvas.saveFrame();
    }
    drawSpherePhongShaded(t) {
        let ray_origin = new Point(0, 0, -5);
        let wall_z = 10;
        let wall_size = 7;
        let canvas_pixels = 400;
        let pixel_scale = 1;
        let pixel_size = wall_size / canvas_pixels;
        let half = wall_size / 2;
        this.canvas.startNewFrame();
        let color = new Color(.8, .65, .3);
        let bgcolor = new Color(.8, .7, .6);
        this.canvas.setPixelRect(0, 0, canvas_pixels * pixel_scale, canvas_pixels * pixel_scale, bgcolor);

        let shape = new Sphere(mt.Rotation_z(Math.PI * t / 30).Rotate_x(Math.PI * t / 100).Scale(.75, .45, 1), new Material(color, .3, .4, .3, 40));
        let light_position = new Point(-10, 10, -10);
        let light_color = new Color(1, 1, 1);
        let light = new PointLight(light_color, light_position);


        for (let y = 0; y < canvas_pixels; y++) {
            let world_y = half - pixel_size * y;
            for (let x = 0; x < canvas_pixels; x++) {
                let world_x = half - pixel_size * x;
                let position = new Point(world_x, world_y, wall_z);
                let r = new Ray(ray_origin, mo.Normalize(position.Subtract(ray_origin)));
                let xs = int.Intersect(r, shape);
                let edge = true;
                let edgeDist = 0;
                let edgeSize = .35;
                if (xs.length > 0) {
                    edgeDist = Math.abs(xs[0].t - xs[1].t);
                    edge = edgeDist < edgeSize ? true : false;
                    edgeDist = (edgeDist / edgeSize);
                }
                let hit = int.Hit(xs);
                if (hit != undefined) {
                    let point = r.Position(hit.t);
                    let normal = so.NormalAt(hit.object, point)
                    let eye = r.d.Negate();
                    let c = so.Lighting(hit.object.material, light, point, eye, normal);
                    if (edge) c = new Color((c.r * edgeDist + bgcolor.r * (1 - edgeDist)),
                        (c.g * edgeDist + bgcolor.g * (1 - edgeDist)),
                        (c.b * edgeDist + bgcolor.b * (1 - edgeDist)));
                    // if (edge) c = new Color(edgeDist,edgeDist,edgeDist);
                    this.canvas.setPixelRect(x * pixel_scale, y * pixel_scale, pixel_scale, pixel_scale, c);
                }
            }
        }
        this.canvas.saveFrame();
    }
    drawWorldPhongShaded(t) {
        let ray_origin = new Point(0, 0, -5);
        let wall_z = 10;
        let wall_size = 7;
        let canvas_pixels = 400;
        let pixel_scale = 1;
        let pixel_size = wall_size / canvas_pixels;
        let half = wall_size / 2;
        this.canvas.startNewFrame();
        let color = new Color(1, 0, 0);
        let bgcolor = new Color(.8, .7, .6);
        this.canvas.setPixelRect(0, 0, canvas_pixels * pixel_scale, canvas_pixels * pixel_scale, bgcolor);

        //let shape1 = new Sphere(mt.Rotation_z(Math.PI * t / 30).Rotate_x(Math.PI * t / 100).Scale(.75, .45, 1), new Material(new Color(.8, .2, .1), .3, .4, .3, 40));
        let shape1 = new Sphere(mt.Translation(-.1, 0, 0).Scale(.1, .1, .1), new Material(new Color(.8, .2, .1), .3, .4, .3, 40));
        let shape2 = new Sphere(mt.Translation(.3, 0, 0).Scale(.1, .1, .1), new Material(new Color(.6, .6, .3), .1, .8, .7, 8));
        let shape3 = new Sphere(mt.Translation(-.5, 2, 10).Scale(0.25, 0.75, 0.25), new Material(new Color(.1, .2, .7), .9, .9, .9, 100));
        let light_position = new Point(-10, 10, -10);
        let light_color = new Color(1, 1, 1);
        let light = new PointLight(light_color, light_position);

        //let world = new World(shape1, shape2, shape3, light);
        //let world = new World(shape1, shape2, shape3, light);
        let world = new World();
        world.shapes[1].transform = world.shapes[1].transform.Translate(1, 1, 0);



        for (let y = 0; y < canvas_pixels; y++) {
            let world_y = half - pixel_size * y;
            for (let x = 0; x < canvas_pixels; x++) {
                let world_x = half - pixel_size * x;
                let colorsum = new Color(0, 0, 0);
                let aa = 2;
                for (let i = 0; i < aa - 1; i++) {
                    for (let j = 0; j < aa - 1; j++) {
                        let offx = (aa / 2 - i) * pixel_size;
                        let offy = (aa / 2 - j) * pixel_size;
                        let position = new Point(world_x + offx, world_y + offy, wall_z);
                        let r = new Ray(ray_origin, mo.Normalize(position.Subtract(ray_origin)));

                        let c = so.ColorAt(world, r);
                        colorsum = colorsum.Add(c);
                    }
                }
                let c = new Color(Math.pow(colorsum.r / (aa * aa), 1 / 2.2),
                    Math.pow(colorsum.g / (aa * aa), 1 / 2.2),
                    Math.pow(colorsum.b / (aa * aa), 1 / 2.2));
                this.canvas.setPixelRect(x * pixel_scale, y * pixel_scale, pixel_scale, pixel_scale, c);
            }
        }

        this.canvas.saveFrame();
    }
    drawSphereWithNormals(t) {
        let ray_origin = new Point(0, 0, -20);
        let wall_z = 10;
        let wall_size = 7;
        let canvas_pixels = 300;
        let pixel_scale = 2;
        let pixel_size = wall_size / canvas_pixels;
        let half = wall_size / 2;
        this.canvas.startNewFrame();
        let color = new Color(255, 82, 32);
        let bgcolor = new Color(33, 115, 115);
        this.canvas.setPixelRect(0, 0, canvas_pixels * pixel_scale, canvas_pixels * pixel_scale, bgcolor);

        let shape = new Sphere();
        shape.color = color;

        function buildArrow(ray, color, n = 5, scale = .05) {
            let o = [];
            for (let i = 0; i < n; i++) {
                let p = new Point(
                    ray.o.x + ray.d.x * i / n,
                    ray.o.y + ray.d.y * i / n,
                    ray.o.z + ray.d.z * i / n);
                let s = new Sphere(mt.Translation(p.x, p.y, p.z).Scale(scale, scale, scale));
                s.color = color;
                o.push(s);
            }
            return o;
        }

        let shapes = [shape, ...buildArrow(new Ray(new Point(0, 0, 1), new Vector(0, 0, 1)), new Color(255, 255, 255), 5, .05)];

        for (let y = 0; y < canvas_pixels; y++) {
            let world_y = half - pixel_size * y;
            for (let x = 0; x < canvas_pixels; x++) {
                let world_x = half - pixel_size * x;
                let position = new Point(world_x, world_y, wall_z);
                let r = new Ray(ray_origin, mo.Normalize(position.Subtract(ray_origin)));
                for (let i = 0; i < shapes.length; i++) {
                    let xs = int.Intersect(r, shapes[i]);
                    let hit = int.Hit(xs);
                    if (hit != undefined) {
                        let dist = (hit.t - 20 + 1) * 200;
                        let newColor = new Color(
                            shapes[i].color.r - dist,
                            shapes[i].color.g - dist,
                            shapes[i].color.b - dist);
                        this.canvas.setPixelRect(x * pixel_scale, y * pixel_scale, pixel_scale, pixel_scale, newColor);
                    }
                }
            }
        }
        this.canvas.drawPoint(new Point(1, 0, 0), ray_origin, pixel_size, color);
        this.canvas.saveFrame();
    }
    drawSphereJMU(t) {
        this.canvas.startNewFrame();
        //let m = mt.Translation(0, 0, Math.sin(t / 5000) * 1.5).Rotate_x(t / 1000).Shear(1.5, 0, 0, 0, 0, 0).Scale(2, 2, 2);
        let m = mt.Rotation_x(t / 1000).Shear(1.5, 0, 0, 0, 0, 0).Scale(2, 2, 2);
        //let m = mo.Get4x4IdentityMatrix().Scale(2,2,2).Shear(.4, 0,0,0,0,0);
        let s = new Sphere(m);

        let o = new Point(0, 0, -5);
        let d = new Vector(0, 0, 1);
        let dmag = 1;

        let n = 750;
        let fov = (120 / 360) * 2 * Math.PI;

        let w = 1;
        let h = 1;

        let bgColor = new Color(12, 14, 25);
        let sphereColor = new Color(67, 160, 75);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let c = bgColor;
                let xrot = (fov / n) * (i - n / 2);
                let yrot = (fov / n) * (j - n / 2);

                let passes = 20;
                let range = .055;

                for (let k = 0; k < passes; k++) {
                    let r = new Ray(o.Add(new Vector((Math.random() + Math.random() - 1) * range, (Math.random() + Math.random() - 1) * range, (Math.random() + Math.random() - 1) * range)), d.Rotate_x(xrot).Rotate_y(yrot));
                    let intersections = r.Intersect(s);

                    let hit = int.Hit(intersections);
                    if (hit != undefined) {
                        let r2 = r.Transform(s.transform);
                        let depth = Math.floor(this.canvas.remap(hit.t / mo.Magnitude(r2.d), -200, 200, 0, 3.5));
                        c = new Color((c.r * passes + (sphereColor.r - depth)) / passes,
                            (c.g * passes + (sphereColor.g - depth)) / passes,
                            (c.b * passes + (sphereColor.b - depth)) / passes);
                    }
                }

                this.canvas.setPixelRect(i * w, j * h, w, h, c);
            }
        }
        this.canvas.saveFrame();

    }
    RenderCameraCanvas(camera, pixel_scale = 1, workerNum = undefined, maxWorkers = undefined) {
        //this.canvas.startNewFrame();
        if (maxWorkers != undefined && workerNum != undefined) {
            let area = camera.hsize * camera.vsize;
            let aspect = camera.hsize / camera.vsize;

            //xy = area/maxWorkers
            //x/y = aspect
            //x = y*aspect
            //y = area/(maxWorkers*y*aspect)
            //y = sqrt(area/(maxWorkers*aspect))

            let height = Math.sqrt(area / (maxWorkers * aspect));
            let width = height * aspect;

            let workersPerRow = Math.ceil(camera.hsize / width);

            let xcell = workerNum % workersPerRow;
            let ycell = Math.floor(workerNum / workersPerRow);

            for (let x = width * xcell; x < width * (xcell + 1); x++) {
                for (let y = height * ycell; y < height * (ycell + 1); y++) {
                    let c = camera.GetPixel(x, y);
                    this.canvas.setPixelRect(x * pixel_scale, y * pixel_scale, pixel_scale, pixel_scale, c);
                }
            }
        } else {
            this.canvas.startNewFrame();
            for (let x = 0; x < camera.hsize - 1; x++) {
                for (let y = 0; y < camera.vsize - 1; y++) {
                    let c = camera.GetPixel(x, y);
                    this.canvas.setPixelRect(x * pixel_scale, y * pixel_scale, pixel_scale, pixel_scale, c);
                }
            }
            this.canvas.saveFrame();
        }
        //this.canvas.saveFrame();
    }


}