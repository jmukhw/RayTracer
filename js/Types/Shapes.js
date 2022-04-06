export { Sphere }
import * as mo from "../Operations/MatrixOps.js"
import * as mt from "../Operations/MatrixTrans.js"
import * as int from "../Operations/Intersections.js"

class Sphere {
    /**
     * A sphere
     */
    constructor() {
        if (globalThis.rtuid == undefined) {
            globalThis.rtuid = 0;
        } else { globalThis.rtuid++; }
        this.uid = globalThis.rtuid;
    }
}