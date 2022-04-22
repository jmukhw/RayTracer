export {Equals, 
    ScalarsEqual, 
    Add, 
    Subtract, 
    Negate, 
    ScalarMultiply,
    MatrixMultiply, 
    MultiplyColors, 
    ScalarDivide,
    Magnitude, 
    Normalize, 
    Dot, 
    Cross,
    Get4x4IdentityMatrix,
    MatrixTranspose,
    MatrixDeterminant,
    Submatrix,
    MatrixMinor,
    MatrixCofactor,
    IsInvertable,
    MatrixInvert,
    TransformRay,
    Smoothstep}

import { Touple, Point, Vector, Ray } from "../Types/Touple.js"
import { Color } from "../Types/Color.js"
import { Matrix } from "../Types/Matrix.js"
import { Translation } from "./MatrixTrans.js"

// epsilon is the acceptable difference between two equal numbers
let epsilon = .0001;
/**
 * Test if two Touples or Matrices are approximately equal
 * @param {(Touple|Color|Matrix)} A
 * @param {(Touple|Color|Matrix)} B
 * @return {boolean}
 */
function Equals(A, B) {
    if (A instanceof Touple & B instanceof Touple) {
        if (Math.abs(A.x-B.x) < epsilon &
            Math.abs(A.y-B.y) < epsilon &
            Math.abs(A.z-B.z) < epsilon &
            Math.abs(A.w-B.w) < epsilon) {
            return true
        }
        return false;
    } else if (A instanceof Color & B instanceof Color) {
        if (Math.abs(A.r-B.r) < epsilon &
            Math.abs(A.g-B.g) < epsilon &
            Math.abs(A.b-B.b) < epsilon) {
            return true
        }
        return false;
    } else if (A instanceof Matrix & B instanceof Matrix) {
        if (A.rows == B.rows & A.cols == B.cols) {
            for (let i = 0; i < A.values.length; i++) {
                if (!ScalarsEqual(A.values[i], B.values[i])) return false;
            }
            return true;
        } else return false;

    }
    
    throw Error("Equal called with at least one object that was not an instance of {Touple}: A " + typeof A + " B " + typeof B + " A " + A instanceof Matrix +  " B " + B instanceof Matrix );
}
/**
 * Test if two scalars are approximately equal
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 */
 function ScalarsEqual(a, b) {
    if (typeof(a) == 'number' & typeof(b) == 'number') {
        if (Math.abs(a-b) < epsilon) {
            return true
        }
        return false;
    }
    throw Error("ScalarEquals called with at least one argument that was not a {number}");
}


/**
 * Add Touple, Color, or Matrix A + B
 * @param {(Touple|Color|Matrix)} A
 * @param {(Touple|Color|Matrix)} B
 * @return {(Touple|Color|Matrix)}
 */
function Add(A, B) {
    if (A instanceof Touple & B instanceof Touple) {
        return new Touple(A.x+B.x, A.y+B.y, A.z+B.z, A.w+B.w);
    } else if (A instanceof Color & B instanceof Color) {
        return new Color(A.r+B.r, A.g+B.g, A.b+B.b);
    }
    throw Error("Add called with at least one object that was not an instance of {Touple|Color}");
}

/**
 * Subtract Touple, Color, or Matrix A - B
 * @param {(Touple|Color|Matrix)} A
 * @param {(Touple|Color|Matrix)} B
 * @return {(Touple|Matrix)}
 */
 function Subtract(A, B) {
    if (A instanceof Touple & B instanceof Touple) {
        return new Touple(A.x-B.x, A.y-B.y, A.z-B.z, A.w-B.w);
    } else if (A instanceof Color & B instanceof Color) {
        return new Color(A.r-B.r, A.g-B.g, A.b-B.b);
    }
    throw Error("Subtract called with at least one object that was not an instance of {Touple|Color}");
}

/**
 * Negate Touple or Matrix -a
 * @param {(Touple|Matrix)} a
 * @return {(Touple|Matrix)}
 */
 function Negate(A) {
    if (A instanceof Touple) {
        return new Touple(-A.x, -A.y, -A.z, -A.w);
    }
    throw Error("Negate called with an object that was not an instance of {Touple}");
}

/**
 * Element-wise multiplication of a Touple, Color or Matrix by a number: a*B
 * @param {number} a
 * @param {(Touple|Color|Matrix)} B
 * @return {(Touple|Color|Matrix)}
 */
 function ScalarMultiply(a, B) {
    if (typeof(a) == 'number' & B instanceof Point) {
        return new Point(B.x*a, B.y*a, B.z*a);
    } else if (typeof(a) == 'number' & B instanceof Vector) {
        return new Vector(B.x*a, B.y*a, B.z*a);
    } else if (typeof(a) == 'number' & B instanceof Touple) {
        return new Touple(B.x*a, B.y*a, B.z*a, B.w*a);
    } else if (typeof(a) == 'number' & B instanceof Color) {
        return new Color(B.r*a, B.g*a, B.b*a);
    }
    throw Error("Multiply with arguments other than {number} and {Touple}");
}

/**
 * Element-wise multiplication of two colors (Hadamard product)
 * @param {Color} a
 * @param {Color} B
 * @return {Color}
 */
function MultiplyColors(A, B) {
    if (A instanceof Color & B instanceof Color) {
        return new Color(A.r*B.r, A.g*B.g, A.b*B.b);
    }
}

/**
 * Element-wise division of a Touple, Color, or Matrix B/a
 * @param {number} a
 * @param {(Touple|Color|Matrix)} B
 * @return {(Touple|Matrix)}
 */
 function ScalarDivide(a, B) {
    if (typeof(a) == 'number' & B instanceof Touple) {
        return new Touple(B.x/a, B.y/a, B.z/a, B.w/a);
    } else if (typeof(a) == 'number' & B instanceof Color) {
        return new Color(B.r/a, B.g/a, B.b/a);
    }
    throw Error("Divide with arguments other than {number} and {Touple}");
}

/**
 * Magnitude of Touple A
 * @param {Touple} A
 * @return {number}
 */
 function Magnitude(A) {
    if (A instanceof Touple) {
        return Math.sqrt(A.x*A.x+A.y*A.y+A.z*A.z+A.w*A.w)
    }
    throw Error("Magnitude called with type other than {Touple}");
}

/**
 * Normalize Touple A
 * @param {Touple} A
 * @return {Touple}
 */
 function Normalize(A) {
    if (A instanceof Vector) {
        let m = Magnitude(A);
        return new Vector(A.x/m, A.y/m, A.z/m);
    }
    if (A instanceof Touple) {
        let m = Magnitude(A);
        return new Touple(A.x/m, A.y/m, A.z/m, A.w/m);
    }
    throw Error("Magnitude called with type other than {Touple}");
}

/**
 * Dot product of Tuples A dot B
 * @param {Touple} A
 * @param {Touple} B
 * @return {number}
 */
 function Dot(A, B) {
    if (A instanceof Touple & B instanceof Touple) {
        return A.x*B.x + A.y*B.y + A.z*B.z + A.w*B.w;
    }
    throw Error("Dot called with at least one object that was not an instance of {Touple}");
}

/**
 * Cross product of Vectors A cross B
 * If Touples or points are passed, the w component will be discarded.
 * @param {Vector} A
 * @param {Vector} B
 * @return {Vector}
 */
 function Cross(A, B) {
    if (A instanceof Touple & B instanceof Touple) {
        return new Vector(A.y*B.z - A.z*B.y,
                          A.z*B.x - A.x*B.z,
                          A.x*B.y - A.y*B.x);
    }
    throw Error("Cross called with at least one object that was not an instance of {Touple}");
}

/**
 * Multiply two matrices or a matrix and a touple. Returns a touple if one of the inputs is a
 * touple, otherwise returns a matrix.
 * @param {Matrix|Touple} A
 * @param {Matrix|Touple} B
 * @return {Matrix|Touple}
 */
 function MatrixMultiply(A, B) {
    let returnTouple = false;
    let D;
    if (A instanceof Touple & B instanceof Matrix) {
        if (B.rows != 4) throw Error("Matrix Multiply Error: Different number of columns in A (4) and rows in B (" + B.rows + ")");
        D = A;
        A = new Matrix(1,4,[A.x, A.y, A.z, A.w]);
        returnTouple = true;
    } else if (B instanceof Touple & A instanceof Matrix) {
        if (A.cols != 4) throw Error("Matrix Multiply Error: Different number of columns in A (" + A.cols + ") and rows in B (4)");
        D = B;
        B = new Matrix(4,1,[B.x, B.y, B.z, B.w]);
        returnTouple = true;
    }
    if (A instanceof Matrix & B instanceof Matrix) {
        if (A.cols != B.rows) throw Error("Matrix Multiply Error: Different number of columns in A (" + A.cols + ") and rows in B (" + B.rows + ")");
        let rows = A.rows;
        let cols = B.cols;
        let C = new Matrix(rows, cols);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let v = 0;
                for (let k = 0; k < A.cols; k++) {
                    v += A.values[i*A.cols+k] * B.values[j+B.cols*k]
                }
                C.values[i*cols+j] = v;
            }
        }
        if (returnTouple){
          if (D.constructor.name == 'Point') return new Point(C.values[0], C.values[1], C.values[2])
          if (D.constructor.name == 'Vector') return new Vector(C.values[0], C.values[1], C.values[2])
          return new Touple(C.values[0], C.values[1], C.values[2], C.values[3])
        } 
        return C;
    }
    throw Error("Matrix multiply called with at least one object that was not an instance of {Matrix}");
}

/**
 * Returns a 4x4 identity matrix
 * @return {Matrix}
 */
function Get4x4IdentityMatrix() {
    return new Matrix(4,4,
        [1,0,0,0,
         0,1,0,0,
         0,0,1,0,
         0,0,0,1]);
}


/**
 * Returns the transpose of a matrix
 * @param {Matrix} A
 * @return {Matrix}
 */
function MatrixTranspose(A) {
    if (A instanceof Matrix) {
        let B = new Matrix(A.cols, A.rows);
        
        for (let i = 0; i < A.rows; i++) {
            for (let j = 0; j < A.cols; j++) {
                B.values[j*A.cols+i] = A.values[i*A.cols+j];
            }
        }
        return B;
    }
    throw Error("MatrixTranspose called with argument other than Matrix: " + A)
}

/**
 * Returns the determinant of a square matrix
 * @param {Matrix} A
 * @return {number}
 */
 function MatrixDeterminant(A) {
    if (A instanceof Matrix) {
        if (A.cols == 2 & A.rows == 2) {
            return A.values[0]*A.values[3]-A.values[1]*A.values[2];
        }
        let det = 0;
        for (let j = 0; j < A.cols; j++) {
            det += A.values[j] * MatrixCofactor(A, 0, j)
        }
        return det;
    } 
    throw Error("MatrixDeterminant called with argument other than Matrix: " + A)
}

/**
 * Returns a new matrix that is a submatrix of a given matrix i.e., one specified row and column removed
 * @param {Matrix} A
 * @param {number} row
 * @param {number} col
 * @return {Matrix}
 */
 function Submatrix(A, row, col) {
    if (A instanceof Matrix & A.cols >= col & A.rows >= row) {
        let B = new Matrix(A.rows-1, A.cols-1);
        for (let i = 0; i < A.rows; i++) {
            for (let j = 0; j < A.cols; j++) {
                if (i != row & j != col) {
                    let newRow = i < row ? i : i-1;
                    let newCol = j < col ? j : j-1;
                    B.values[newRow * B.cols + newCol] = A.values[i*A.cols+j];
                }
            }
        }
        return B;
    } 
    throw Error("Submatrix called with argument other than Matrix, or specified row/column exceeded size of matrix: " + A + " row: " + row + " col: " + col)
}

/**
 * Returns the minor of a 3x3 matrix at (i, j) which is the determinant of the submatrix at that point
 * @param {Matrix} A
 * @param {number} row
 * @param {number} col
 * @return {number}
 */
 function MatrixMinor(A, row, col) {
    if (A instanceof Matrix & A.cols >= col & A.rows >= row) {
        let B = Submatrix(A, row, col);
        return MatrixDeterminant(B);
    } 
    throw Error("MatrixMinor called with argument other than Matrix, or specified row/column exceeded size of matrix: " + A + " row: " + row + " col: " + col)
}

/**
 * Returns cofactor a 3x3 matrix at (i, j) which is the determinant of the minor at that point with the sign adjusted depending on its position
 * @param {Matrix} A
 * @param {number} row
 * @param {number} col
 * @return {number}
 */
 function MatrixCofactor(A, row, col) {
    if (A instanceof Matrix & A.cols >= col & A.rows >= row) {
        let det = MatrixMinor(A, row, col);
        return (row + col)%2==1 ? -det : det;
    } 
    throw Error("MatrixCofactor called with argument other than Matrix, or specified row/column exceeded size of matrix: " + A + " row: " + row + " col: " + col)
}

/**
 * Tests if a matrix is invertable ie determinant is not zero
 * @param {Matrix} A
 * @return {boolean}
 */
function IsInvertable(A) {
    if (A instanceof Matrix) {
        let det = MatrixDeterminant(A);
        if (det == 0) return false
        return true;
    } 
    throw Error("IsInvertable called with argument other than Matrix: " + A );
}


/**
 * Inverts a matrix
 * @param {Matrix} A
 * @return {Matrix}
 */
 function MatrixInvert(A) {
    if (A instanceof Matrix) {
        let det = MatrixDeterminant(A);
        if (det == 0) throw Error("MatrixInvert: matrix could not be inverted (zero determinant) [" + A.rows + "x" + A.cols + "] " + A.values);
        let B = new Matrix(A.rows, A.cols);

        for (let i = 0; i < A.rows; i++) {
            for (let j = 0; j < A.cols; j++) {
                let c = MatrixCofactor(A,i,j);
                B.values[j*A.cols+i] = c/det; //note transpose by switching i and j
            }
        }
        return B;
    } 
    throw Error("MatrixCofactor called with argument other than Matrix, or specified row/column exceeded size of matrix: " + A + " row: " + row + " col: " + col)
}

/**
 * Apply a 4x4 tranformation matrix to a ray
 * @param {Ray} r
 * @param {Matrix} m
 * @return {Ray}
 */
 function TransformRay(r, m) {
    return new Ray(r.o.Premultiply(m), r.d.Premultiply(m));
}
 

/**
 * Remap x between min and max using an Hermite polynomial, return 0 if less than edge0 or 1 if less than edge1
 * @param {number} x
 * @param {number} edge0
 * @param {number} edge1
 * @return {number}
 */
 function Smoothstep(x, edge0, edge1) {
    if (x < edge0) return 0;
    if (x > edge1) return 1;
    return x*x*(3-2*x);
}

