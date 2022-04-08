export { Touple, Vector, Point, Ray, Intersection }
import * as mo from "../Operations/MatrixOps.js"
import * as mt from "../Operations/MatrixTrans.js"
import * as int from "../Operations/Intersections.js"

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
     * Premultiply this Touple by another matrix, touple, or scalar. Returns a touple if one of the inputs is a
     * touple, otherwise returns a matrix.
     * @param {Matrix|Touple|number} A
     * @return {Matrix|Touple}
     */
    Premultiply(A) {
        if (typeof (A) == 'number') return mo.ScalarMultiply(A, this);
        return mo.MatrixMultiply(A, this);
    }
    /**
     * Postmultiply this Touple by another matrix, touple, or scalar. Returns a touple if one of the inputs is a
     * touple, otherwise returns a matrix.
     * @param {Matrix|Touple|number} A
     * @return {Matrix|Touple}
     */
    Postmultiply(A) {
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
     * Magnitude of this
     * @return {number}
     */
    Magnitude() {
        return mo.Magnitude(this);
    }

    /**
     * Normalize this
     * @return {Touple}
     */
    Normalize() {
        mo.Normalize(this);
    }

    /**
     * Dot product of this dot B
     * @param {Touple} B
     * @return {number}
     */
    Dot(B) {
        return mo.Dot(this, B);
    }

    /**
     * Cross product of this with cross vector B
     * If Touples or points are passed, the w component will be discarded.
     * @param {Vector} B
     * @return {Vector}
     */
    Cross(B) {
        return mo.Cross(this, B);
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
        return mo.MatrixMultiply(mt.Shearing(xy, xz, yx, yz, zx, zy), this);
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

class Ray {
    /**
     * Ray with a point and vector
     * @param {(Point|Touple)} origin
     * @param {(Vector|Touple)} direction
     */
    constructor(origin, direction) {
        this.o = origin;
        this.d = direction;
    }
    /**
     * Compute the point at a given distance t along a ray
     * @param {number} t
     * @return {Point}
     */
    Position(t) {
        return int.Position(this, t);
    }
    /**
     * Compute intersection points between a ray and a sphere. Returns [] if no collisions, 
     * or an array with 2 elements if there are one or two collisions. The elements are the distance
     * along the ray that the collisions occured.
     * @param {Sphere} s
     * @return {Intersection[]}
     */
    Intersect(s) {
        return int.Intersect(this, s);
    }
    /**
     * Apply a 4x4 tranformation matrix to this ray
     * @param {Matrix} m
     * @return {Ray}
     */
    Transform(m) {
        return mo.TransformRay(this, m);
    }
}

class Intersection {
    /**
     * Intersection between a ray and an object
     * @param {number} t
     * @param {Sphere} object
     */
    constructor(t, object) {
        this.t = t;
        this.object = object;
    }
}
