/*
importScripts("./Types/Touple.js",
    "./Display/Canvas.js",
    "./Operations/MatrixOps.js",
    "./Operations/MatrixTrans.js",
    "./Operations/Intersections.js",
    "./Operations/ShapeOps.js",
    "./Types/Color.js",
    "./Types/Shapes.js",
    "./Operations/GaussianOps.js");
*/
import { Touple, Point, Vector, Ray, World } from "./Types/Touple.js";
import { Canvas } from "./Display/Canvas.js"
import * as mo from "./Operations/MatrixOps.js"
import * as mt from "./Operations/MatrixTrans.js"
import * as int from "./Operations/Intersections.js"
import * as so from "./Operations/ShapeOps.js"
import { Color } from "./Types/Color.js";
import { Material, PointLight, Sphere, Camera, Plane, Cube, PatternStriped, PatternGradient, PatternRing, PatternChecker, PatternBlended, GlassSphere } from "./Types/Shapes.js";
import { Ziggurat } from "./Operations/GaussianOps.js"

function RenderCameraCanvasParallel(canvasWidth, canvasHeight, workerNum = 0, totalWorkers = 4) {
    let t = 0;

    let w = GetWorld2();

    let camera = new Camera(canvasWidth, canvasHeight, Math.PI / 2);
    let from = new Point(Math.cos(2 * Math.PI * t) * 6, 4, Math.sin(2 * Math.PI * t) * 4);
    let to = new Point(0, 2, 0);
    let up = new Vector(0, 1, 0);
    camera.transform = mt.ViewTransform(from, to, up);

    let area = camera.hsize * camera.vsize;
    let aspect = camera.hsize / camera.vsize;

    let height = Math.sqrt(area / (totalWorkers * aspect));
    let width = height * aspect;

    let workersPerRow = Math.ceil(camera.hsize / width);

    let xcell = workerNum % workersPerRow;
    let ycell = Math.floor(workerNum / workersPerRow);

    camera.Render(w, 1, width * xcell, width * (xcell + 1), height * ycell, height * (ycell + 1));

    return camera.canvas;

}
function GetWorld2() {
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

    let s = new Cube(mt.Translation(0, 2, 0).Scale(2, 2, 2), m);

    let light = new PointLight(new Color(1, 1, 1).MultipleScalar(2), new Point(5, 9, -3));
    let w = new World(s, light, ...walls);

    return w;
}

function GetWorld1() {
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

    return w;
}


onmessage = function (e) {
    // takes: width, height, workerNum, maxWorkers
    let pixels = RenderCameraCanvasParallel(e.data[0], e.data[1], e.data[2], e.data[3]);
    postMessage(pixels);
}