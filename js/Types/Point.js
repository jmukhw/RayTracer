export {Point}
import { Touple } from "./Touple.js";

class Point extends Touple {
    /**
     * 4-dimensional vector with x, y, z components and w set to 1.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x = 0, y = 0, z = 0) {
        super(x,y,z,1);
        Object.defineProperty(this, 'w', {value: 1, writable: false});
    }
}
