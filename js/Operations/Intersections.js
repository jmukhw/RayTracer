export {Position, Intersect, Intersections, Hit}

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
 * Compute intersection points between a ray and a sphere. Returns [] if no collisions, 
 * or an array with 2 elements if there are one or two collisions. The elements are the distance
 * along the ray that the collisions occured.
 * @param {Ray} r
 * @param {Sphere} s
 * @return {Intersection[]}
 */
 function Intersect(r, s) {
    let rt = r.Transform(s.transform.Invert());
    let sphere_to_ray = rt.o.Subtract(new Point(0,0,0));
    let a = rt.d.Dot(rt.d);
    let b = 2*rt.d.Dot(sphere_to_ray);
    let c = sphere_to_ray.Dot(sphere_to_ray) - 1;
    let discriminant = b*b-4*a*c;
    if (discriminant < 0) return [];
    let t1 = (-b-Math.sqrt(discriminant))/(2*a);
    let t2 = (-b+Math.sqrt(discriminant))/(2*a);
    return Intersections(new Intersection(t1, s), new Intersection(t2, s));
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
