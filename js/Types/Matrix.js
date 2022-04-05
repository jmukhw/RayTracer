export { Matrix }
import * as mo from "../Operations/MatrixOps.js"
import * as mt from "../Operations/MatrixTrans"

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
     * Multiply this matrix by another matrix, touple, or scalar. Returns a touple if one of the inputs is a
     * touple, otherwise returns a matrix.
     * @param {Matrix|Touple|number} A
     * @return {Matrix|Touple}
     */
    Multiply(A) {
        if (typeof (A) == 'number') return mo.ScalarMultiply(A, this);
        return mo.MatrixMultiply(this, A);
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
}