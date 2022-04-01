export { Color }

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
}