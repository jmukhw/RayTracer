export { NormalAt, Reflect, Lighting, ShadeHit, ColorAt }

import { Touple, Point, Vector, Ray, IntersectionComputations } from "../Types/Touple.js"
import { Color } from "../Types/Color.js"
import { Matrix } from "../Types/Matrix.js"
import { MultiplyColors, ScalarMultiply, Add, Smoothstep} from "./MatrixOps.js"
import { Hit } from "./Intersections.js"

/**
 * Computes the normal vector on a sphere at a point, returns the vector. Note that we assume the the point is on the sphere's surface.
 * @param {Sphere} dx
 * @param {Point} dy
 * @return {Vector}
 */
function NormalAt(sphere, world_point) {
    let object_point = sphere.transform.Invert().Premultiply(world_point);
    let object_normal = object_point.Subtract(new Point(0,0,0))
    let world_normal = sphere.transform.Invert().Transpose().Premultiply(object_normal);
    let v = new Vector(world_normal.x, world_normal.y, world_normal.z).Normalize();
    return v;
}

/**
 * Reflects vector 'in' about vector 'normal' and returns it.
 * @param {Vector} vecIn
 * @param {Vector} normal
 * @return {Vector}
 */
 function Reflect(vecIn, normal) {
    return vecIn.Subtract(normal.Premultiply(2).Premultiply(vecIn.Dot(normal))).AsVector();
}

/**
 * Calculates the lighting at a given point
 * @param {Material} material
 * @param {PointLight} light
 * @param {Point} point
 * @param {Vector} eyev
 * @param {Vector} normalv
 * @return {Color}
 */
 function Lighting(material, light, point, eyev, normalv) {
    let diffuse, specular, ambient;
    let effective_color = MultiplyColors(material.color,light.intensity);
    let lightv = light.position.Subtract(point).Normalize();
    ambient = ScalarMultiply(material.ambient, effective_color);
    let light_dot_normal = lightv.Dot(normalv);
    if (light_dot_normal < 0) {
        diffuse = new Color(0,0,0);
        specular = new Color(0,0,0);
    } else {
        diffuse = ScalarMultiply(material.diffuse, ScalarMultiply(light_dot_normal, effective_color));

        let reflectv = Reflect(lightv.Negate(), normalv);
        let reflect_dot_eye = reflectv.Dot(eyev);

        if (reflect_dot_eye <= 0) {
            specular = new Color(0,0,0);
        } else {
            let factor = Math.pow(reflect_dot_eye, material.shininess);
            specular = ScalarMultiply(material.specular, ScalarMultiply(factor, light.intensity));
        }

    } 
    let c = Add(Add(ambient, diffuse), specular);
    return c;
}

/**
 * Calculates the lighting at a given point
 * @param {World} world
 * @param {IntersectionComputations} comps
 * @return {Color}
 */
function ShadeHit(world, comps) {
    let c = new Color(0,0,0);
    for (let i = 0; i < world.lights.length; i++) {
        let l = Lighting(comps.object.material, world.lights[i], comps.point, comps.eyev, comps.normalv);
        c = c.Add(l);
    }
    return c;
}

/**
 * Calculates the lighting at a given point
 * @param {World} world
 * @param {Ray} ray
 * @return {Color}
 */
function ColorAt(world, ray) {
    let xs = world.Intersect(ray);
    let hit = Hit(xs);
    if (hit == undefined) return new Color(0,0,0);
    let comps = hit.getComputations(ray);
    return ShadeHit(world, comps);

}