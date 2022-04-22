export { Color }

import {Equals} from "../Operations/MatrixOps.js"

class Color {
    /**
     * 3-dimensional vector with unclamped red, green, blue components ranging from 0 - 1.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Return a new color with the value of this and a given color added element-wise
     * @param {Color} c
     */
    Add(c) {
        return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
    }

    /**
     * Test if a given color is equal to this color
     * @param {Color} c
     */
    Equals(c) {
        return Equals(this, c);
    }

}