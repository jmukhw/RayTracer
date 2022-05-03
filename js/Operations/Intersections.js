export {Position, Intersections, Hit}

import { Touple, Point, Vector, Ray, Intersection } from "../Types/Touple.js"

import { Color } from "../Types/Color.js"
import { Matrix } from "../Types/Matrix.js"

/**
 * Compute the point at a given distance t along a ray
 * @param {Ray} r
 * @param {number} t
 * @return {Point}
 */
function Position(ray, t) {
    return ray.o.Add(ray.d.Premultiply(t)).AsPoint();
}

/**
 * Aggregate multiple intersections into an array
 * @param {...Intersection} 
 * @return {Intersection[]}
 */
 function Intersections(...intersections) {
    let a = [];
    for (let i = 0; i < intersections.length; i++) {
        a.push(intersections[i]);
    }
    return a;
}

/**
 * Get the hit from an array of Intersections where hit is the intersection
 * with the lowest t value. Returns undefined if no hit.
 * @param {Intersection[]} 
 * @return {Intersection}
 */
 function Hit(intersections) {
    if (intersections.length == 0) return undefined;
    let c;
    for (let i = 0; i < intersections.length; i++) {
        if (intersections[i].t >= 0) {
            if (c == undefined) c = intersections[i];
            else if (intersections[i].t < c.t) c = intersections[i];
        } 
    }
    return c;
}
