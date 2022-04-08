export { Sphere }
import * as mo from "../Operations/MatrixOps.js"
import * as mt from "../Operations/MatrixTrans.js"
import * as int from "../Operations/Intersections.js"

class Sphere {
    /**
     * A sphere with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix
     * @param {Matrix} transform
     */
    constructor(transform) {
        if (globalThis.rtuid == undefined) {
            globalThis.rtuid = 0;
        } else { globalThis.rtuid++; }
        this.uid = globalThis.rtuid;
        if (transform == undefined) transform = mo.Get4x4IdentityMatrix();
        this.transform = transform;
    }
    /**
     * Set the sphere's 4x4 transformation matrix
     * @param {Matrix} transform
     */
    SetTransform(transform) {
        this.transform = transform;
    }
}