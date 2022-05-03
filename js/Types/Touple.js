export { Touple, Vector, Point, Ray, Intersection, World, IntersectionComputations }
import * as mo from "../Operations/MatrixOps.js"
import * as so from "../Operations/ShapeOps.js"
import * as mt from "../Operations/MatrixTrans.js"
import * as int from "../Operations/Intersections.js"
import { Material, PointLight, Sphere, Shape } from "./Shapes.js";
import { Color } from "./Color.js";

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
        return mo.Normalize(this);
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

    /**
     * Casts a Touple, Vector, or Point as a vector. Discards the w component.
     * @return {Vector}
     */
    AsVector() {
        return new Vector(this.x, this.y, this.z);
    }
    
    /**
     * Casts a Touple, Vector, or Point as a point. Discards the w component.
     * @return {Point}
     */
     AsPoint() {
        return new Point(this.x, this.y, this.z);
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
        //Object.defineProperty(this, 'w', { value: 0, writable: false });
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
        //Object.defineProperty(this, 'w', { value: 1, writable: false });
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
    /**
     * Calculates various values for the intersection and returns an IntersectionComputations object
     * @param {Ray} r
     */
    getComputations(r) {
        return new IntersectionComputations(r, this);
    }
}

class World {
    /**
    * World to hold objects and light sources
    * @param {...(Shape|PointLight)} ...args
    */
    constructor(...args) {
        this.shapes = [];
        this.lights = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i] instanceof PointLight)
                this.lights.push(args[i]);
            else if (args[i] instanceof Shape)
                this.shapes.push(args[i]);
        }
        if (this.shapes.length == 0 && this.lights.length == 0) {
            let l = new PointLight(new Color(1, 1, 1), new Point(-10, 10, -10));
            let s1 = new Sphere(mo.Get4x4IdentityMatrix(), new Material(new Color(.8, 1, .6), .1, .7, .2));
            let s2 = new Sphere(mo.Get4x4IdentityMatrix().Scale(.5, .5, .5));
            this.lights.push(l);
            this.shapes.push(s1, s2);
        }
    }
    /**
     * Compute intersection points between a ray and all the shapes in a world. Returns [] if no collisions, 
     * or an array of intersection objects with 2 elements for each collision if there are any. 
     * If the intersection is on the tangent of the object (only one solution to the intersection), the same
     * distance is given in two separate intersection objects. The intersection objects contain a reference
     * to the object struck and the distance along the ray that the collisions occured. The intersection
     * objects are sorted from closest to furthest. 
     * @param {Ray} r
     * @return {Intersection[]}
     */
    Intersect(r) {
        let w = this;
        let intersections = [];
        for (let i = 0; i < w.shapes.length; i++) {
            let rayints = w.shapes[i].Intersect(r);
            if (intersections.length == 0) intersections.push(...rayints);
            else {
                for (let j = 0; j < rayints.length; j++) {
                    for (let k = 0; k < intersections.length; k++) {
                        if (rayints[j].t < intersections[k].t) {
                            intersections.splice(k, 0, rayints[j]);
                            break;
                        } else if (k == intersections.length - 1) {
                            intersections.push(rayints[j]);
                            break;
                        }
                    }
                }
            }
        }
        return intersections;
    }
}

class IntersectionComputations {
    /**
    * Various pre-computed values for intersections
    * @param {Ray} r
    * @param {Intersection} intersection
    */
    constructor(r, intersection) {
        this.t = intersection.t;
        this.object = intersection.object;
        this.point = r.Position(this.t);
        this.eyev = r.d.Negate();
        this.normalv = this.object.NormalAt(this.point);
        this.over_point = this.point.Add(this.normalv.Premultiply(0.0001));

        if (this.normalv.Dot(this.eyev) < 0) {
            this.inside = true;
            this.normalv = this.normalv.Negate();
        } else {
            this.inside = false;
        }
    }
}


