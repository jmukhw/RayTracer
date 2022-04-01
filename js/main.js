import { RayTracer } from "./RayTracer.js";

window.onload = function () {
    var rt = new RayTracer(document.getElementById("canvas"));
    rt.draw();
}