export { Touple, Vector, Point }
import * as mo from "../Operations/MatrixOps.js"
import * as mt from "../Operations/MatrixTrans"

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
        return mo.Equals(this, A);
    }
    /**
     * Add Touple, or Matrix (this + A)
     * @param {(Touple|Matrix)} A
     * @return {(Touple|Matrix)}
     */
    Add(A) {
        return mo.Add(this, A);
    }
    /**
     * Subtract Touple or Matrix from this Touple (this - A)
     * @param {(Touple|Matrix)} A
     * @return {(Touple|Matrix)}
     */
    Subtract(A) {
        return mo.Subtract(this, A);
    }
    /**
     * Negate all elements of this Touple
     * @return {Touple}
     */
    Negate() {
        return mo.Negate(this);
    }
    /**
     * Multiply this Touple by another matrix, touple, or scalar. Returns a touple if one of the inputs is a
     * touple, otherwise returns a matrix.
     * @param {Matrix|Touple|number} A
     * @return {Matrix|Touple}
     */
    Multiply(A) {
        if (typeof (A) == 'number') return mo.ScalarMultiply(A, this);
        return mo.MatrixMultiply(this, A);
    }
    /**
     * Element-wise division of this Touple by a scalar.
     * @param {number} n
     * @return {Matrix}
     */
    Divide(A) {
        if (typeof (A) == 'number') return mo.ScalarDivide(A, this);
        throw Error("Divide called with non-scalar input");
    }
    /**
     * Returns this object multiplied by a 4x4 transformation matrix representing the translation by delta x, y, z
     * @param {number} dx
     * @param {number} dy
     * @param {number} dz
     * @return {Touple|Point|Vector}
     */
    Translate(dx, dy, dz) {
        return mo.MatrixMultiply(mt.Translation(dx, dy, dz), this);
    }
    /**
     * Returns this premultiplied by a 4x4 transformation matrix to scale x, y, z
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {(Touple|Point|Vector)}
     */
    Scale(x, y, z) {
        return mo.MatrixMultiply(mt.Scaling(x, y, z), this);
    }
    /**
     * Returns this premultiplied by a 4x4 transformation matrix representing a rotation around the x axis by a specified number of radians
     * @param {number} rads
     * @return {(Touple|Point|Vector)}
     */
    Rotate_x(rads) {
        return mo.MatrixMultiply(mt.Rotation_x(rads), this);
    }
    /**
     * Returns this premultiplied by a 4x4 transformation matrix representing a rotation around the y axis by a specified number of radians
     * @param {number} rads
     * @return {(Touple|Point|Vector)}
     */
    Rotate_y(rads) {
        return mo.MatrixMultiply(mt.Rotation_y(rads), this);
    }
    /**
    * Returns this premultiplied by a 4x4 transformation matrix representing a rotation around the z axis by a specified number of radians
    * @param {number} rads
    * @return {(Touple|Point|Vector)}
    */
    Rotate_z(rads) {
        return mo.MatrixMultiply(mt.Rotation_z(rads), this);
    }

    /**
     * Returns this premultiplied by a 4x4 transformation matrix representing a shear in which x, y, z are transformed in proportion to each other e.g., xy = 2 adds to a given x by 2*y
     * @param {number} xy
     * @param {number} xz
     * @param {number} yx
     * @param {number} yz
     * @param {number} zx
     * @param {number} zy
     * @return {Matrix}
     */
    Shear(xy, xz, yx, yz, zx, zy) {
        return mo.MatrixMultiply(mt.Shearing(xy,xz,yx,yz,zx,zy), this);
    }
}

class Vector extends Touple {
    /**
     * 4-dimensional vector with x, y, z components and w set to 0.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z, 0);
        Object.defineProperty(this, 'w', { value: 0, writable: false });
    }
}


class Point extends Touple {
    /**
     * 4-dimensional vector with x, y, z components and w set to 1.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z, 1);
        Object.defineProperty(this, 'w', { value: 1, writable: false });
    }
}
