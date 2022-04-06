export {Position, Intersect}

import { Touple, Point, Vector, Ray } from "../Types/Touple.js"

import { Color } from "../Types/Color.js"
import { Matrix } from "../Types/Matrix.js"

/**
 * Compute the point at a given distance t along a ray
 * @param {Ray} r
 * @param {number} t
 * @return {Point}
 */
function Position(ray, t) {
    return ray.o.Add(ray.d.Multiply(t));
}

/**
 * Compute intersection points between a ray and a sphere. Returns [] if no collisions, 
 * or an array with 2 elements if there are one or two collisions. The elements are the distance
 * along the ray that the collisions occured.
 * @param {Ray} r
 * @param {Sphere} s
 * @return {number[]}
 */
 function Intersect(r, s) {
    let sphere_to_ray = r.o.Subtract(new Point(0,0,0));
    let a = r.d.Dot(r.d);
    let b = 2*r.d.Dot(sphere_to_ray);
    let c = sphere_to_ray.Dot(sphere_to_ray) - 1;
    let discriminant = b*b-4*a*c;
    if (discriminant < 0) return [];
    let t1 = (-b-Math.sqrt(discriminant))/(2*a);
    let t2 = (-b+Math.sqrt(discriminant))/(2*a);
    return [t1, t2];
}