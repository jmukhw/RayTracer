import { RayTracer } from "./RayTracer.js";
let rt;
window.onload = function () {
    rt = new RayTracer(document.getElementById("canvas"));
    window.requestAnimationFrame(step);
}

function step(t) {
    rt.draw(t);
    window.requestAnimationFrame(step);
}