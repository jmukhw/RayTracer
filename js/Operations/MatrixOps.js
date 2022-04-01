export {Equal, ScalarsEqual, Add, Subtract, Negate, ScalarMultiply, MultiplyColors, ScalarDivide, Magnitude, Normalize, Dot, Cross}
import { Touple } from "../Types/Touple.js"
import { Vector } from "../Types/Vector.js";
import { Color } from "../Types/Color.js"

// epsilon is the acceptable difference between two equal numbers
let epsilon = .0001;
/**
 * Test if two Touples or Matrices are approximately equal
 * @param {(Touple|Color|Matrix)} A
 * @param {(Touple|Color|Matrix)} B
 * @return {boolean}
 */
function Equal(A, B) {
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
    }
    throw Error("Equal called with at least one object that was not an instance of {Touple}");
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
    if (typeof(a) == 'number' & B instanceof Touple) {
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


