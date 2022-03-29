

class Point {
    /**
     * 4-dimensional vector with x, y, z components and w set to 1.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        Object.defineProperty(this, 'w', {value: 1, writable: false});
    }
}
export {Point}