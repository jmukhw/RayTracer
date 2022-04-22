export { Matrix }
import * as mo from "../Operations/MatrixOps.js"
import * as mt from "../Operations/MatrixTrans.js"

class Matrix {
    /**
     * An m x n dimensional matrix with values represented as a 1-dimensional array
     * @param {number} rows
     * @param {number} cols
     * @param {number[]} values 
     */
    constructor(rows = 4, cols = 4, values = []) {
        while (values.length < rows * cols) values.push(0);
        while (values.length > rows * cols) values.pop(); // silently remove extra values
        this.rows = rows;
        this.cols = cols;
        this.values = values;
    }
    /**
     * Test if this matrix is approximately equal to another matrix or touple
     * @param {(Touple|Matrix)} A
     * @return {boolean}
     */
    Equals(A) {
        return mo.Equals(this, A);
    }
    /**
     * Add Touple, Color, or Matrix A + B
     * @param {(Touple|Matrix)} A
     * @return {(Touple|Matrix)}
     */
    Add(A) {
        return mo.Add(this, A);
    }
    /**
     * Subtract Touple or Matrix from this matrix (this - A)
     * @param {(Touple|Matrix)} A
     * @return {(Touple|Matrix)}
     */
    Subtract(A) {
        return mo.Subtract(this, A);
    }
    /**
     * Negate all elements of this matrix
     * @return {Matrix}
     */
    Negate() {
        return mo.Negate(this);
    }
    /**
     * Premultiply this matrix by another matrix, touple, or scalar. Returns a touple if one of the inputs is a
     * touple, otherwise returns a matrix. this*A
     * @param {Matrix|Touple|number} A
     * @return {Matrix|Touple}
     */
    Premultiply(A) {
        if (typeof (A) == 'number') return mo.ScalarMultiply(A, this);
        return mo.MatrixMultiply(this, A);
    }
    /**
     * Postmultiply this matrix by another matrix, touple, or scalar. Returns a touple if one of the inputs is a
     * touple, otherwise returns a matrix. A*this
     * @param {Matrix|Touple|number} A
     * @return {Matrix|Touple}
     */
    Postmultiply(A) {
        if (typeof (A) == 'number') return mo.ScalarMultiply(A, this);
        return mo.MatrixMultiply(A,this);
    }
    /**
     * Element-wise division of this matrix by a scalar.
     * @param {number} n
     * @return {Matrix}
     */
    Divide(A) {
        if (typeof (A) == 'number') return mo.ScalarDivide(A, this);
        throw Error("Divide called with non-scalar input");
    }
    /**
     * Returns the transpose of this matrix
     * @return {Matrix}
     */
    Transpose() {
        return mo.MatrixTranspose(this);
    }
    /**
     * Returns the determinant of this matrix
     * @return {number}
     */
    Determinant() {
        return mo.MatrixDeterminant(this);
    }
    /**
     * Returns the inversion of this matrix
     * @return {Matrix}
     */
    Invert() {
        return mo.MatrixInvert(this);
    }
    /**
     * Returns this object postmultiplied by a 4x4 transformation matrix representing the translation by delta x, y, z
     * @param {number} dx
     * @param {number} dy
     * @param {number} dz
     * @return {Matrix}
     */
    Translate(dx, dy, dz) {
        return mo.MatrixMultiply(this, mt.Translation(dx, dy, dz));
    }
    /**
     * Returns this postmultiplied by a 4x4 transformation matrix to scale x, y, z
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {Matrix}
     */
    Scale(x, y, z) {
        return mo.MatrixMultiply(this, mt.Scaling(x, y, z));
    }
    /**
     * Returns this postmultiplied by a 4x4 transformation matrix representing a rotation around the x axis by a specified number of radians
     * @param {number} rads
     * @return {Matrix}
     */
    Rotate_x(rads) {
        return mo.MatrixMultiply(this, mt.Rotation_x(rads));
    }
    /**
     * Returns this postmultiplied by a 4x4 transformation matrix representing a rotation around the y axis by a specified number of radians
     * @param {number} rads
     * @return {Matrix}
     */
    Rotate_y(rads) {
        return mo.MatrixMultiply(this, mt.Rotation_y(rads));
    }
    /**
    * Returns this postmultiplied by a 4x4 transformation matrix representing a rotation around the z axis by a specified number of radians
    * @param {number} rads
    * @return {Matrix}
    */
    Rotate_z(rads) {
        return mo.MatrixMultiply(this, mt.Rotation_z(rads));
    }

    /**
     * Returns this postmultiplied by a 4x4 transformation matrix representing a shear in which x, y, z are transformed in proportion to each other e.g., xy = 2 adds to a given x by 2*y
     * @param {number} xy
     * @param {number} xz
     * @param {number} yx
     * @param {number} yz
     * @param {number} zx
     * @param {number} zy
     * @return {Matrix}
     */
    Shear(xy, xz, yx, yz, zx, zy) {
        return mo.MatrixMultiply(this, mt.Shearing(xy, xz, yx, yz, zx, zy));
    }
}