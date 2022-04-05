export {Vector}
import { Touple } from "./Touple.js";
import * as mo from "../Operations/MatrixOps.js"
import * as mt from "../Operations/MatrixTrans"

class Vector extends Touple{
    /**
     * 4-dimensional vector with x, y, z components and w set to 0.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x = 0, y = 0, z = 0) {
        super(x,y,z,0);
        Object.defineProperty(this, 'w', {value: 0, writable: false});
    }
}