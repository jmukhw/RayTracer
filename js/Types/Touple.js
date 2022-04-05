export { Touple }
//import * as mo from "../Operations/MatrixOps.js"
import {Equals}  from "../Operations/MatrixOps.js"
//import * as mt from "../Operations/MatrixTrans"

class Touple {
    /**
     * 4-dimensional vector with x, y, z, w components.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * Test if this touple is approximately equal to another matrix or touple
     * @param {(Touple|Matrix)} A
     * @return {boolean}
     */
    Equals(A) {
        return Equals(this, A);
    }

}