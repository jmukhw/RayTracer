export { Reflect, Lighting, ShadeHit, ColorAt, ReflectedColor, IsShadowed, SoftShadowAmount }

import { Touple, Point, Vector, Ray, IntersectionComputations } from "../Types/Touple.js"
import { Color } from "../Types/Color.js"
import { Matrix } from "../Types/Matrix.js"
import { MultiplyColors, ScalarMultiply, Add, Smoothstep } from "./MatrixOps.js"
import { Hit } from "./Intersections.js"
import * as mt from "./MatrixTrans.js"

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
 * @param {Shape} shape
 * @param {PointLight} light
 * @param {Point} point
 * @param {Vector} eyev
 * @param {Vector} normalv
 * @return {Color}
 */
function Lighting(material, shape, light, point, eyev, normalv, amt_shadowed = 0) {
    let diffuse, specular, ambient, effective_color;
    if (material.pattern == undefined) {
        effective_color = MultiplyColors(material.color, light.intensity);
    } else {
        effective_color = material.pattern.ColorAt(point, shape);
    }
    let lightv = light.position.Subtract(point).Normalize();
    ambient = ScalarMultiply(material.ambient, effective_color);
    if (amt_shadowed == 1) return ambient;
    let light_dot_normal = lightv.Dot(normalv);
    if (light_dot_normal < 0) {
        diffuse = new Color(0, 0, 0);
        specular = new Color(0, 0, 0);
    } else {
        diffuse = ScalarMultiply(material.diffuse, ScalarMultiply(light_dot_normal, effective_color));

        let reflectv = Reflect(lightv.Negate(), normalv);
        let reflect_dot_eye = reflectv.Dot(eyev);

        if (reflect_dot_eye <= 0) {
            specular = new Color(0, 0, 0);
        } else {
            let factor = Math.pow(reflect_dot_eye, material.shininess);
            specular = ScalarMultiply(material.specular, ScalarMultiply(factor, light.intensity));
        }

    }
    diffuse = diffuse.MultipleScalar(1 - amt_shadowed);
    specular = specular.MultipleScalar(1 - amt_shadowed);

    let c = Add(Add(ambient, diffuse), specular);
    return c;
}

/**
 * Calculates the refracted lighting at a given point with the number of reflections remaining
 * @param {World} world
 * @param {IntersectionComputations} comps
 * @param {number} remaining
 * @return {Color}
 */
function RefractedColor(world, comps, remaining = 5) {

}

/**
 * Calculates the lighting at a given point with the number of reflections remaining
 * @param {World} world
 * @param {IntersectionComputations} comps
 * @param {number} remaining
 * @return {Color}
 */
function ShadeHit(world, comps, remaining = 5) {
    let c = new Color(0, 0, 0);
    for (let i = 0; i < world.lights.length; i++) {
        let shadowed = IsShadowed(world, comps.over_point, world.lights[i]);
        //let shadowed = SoftShadowAmount(world, comps.over_point, world.lights[i]);

        let l = Lighting(comps.object.material, comps.object, world.lights[i], comps.point, comps.eyev, comps.normalv, shadowed);
        let reflected = ReflectedColor(world, comps, remaining);

        c = c.Add(l);
        c = c.Add(reflected);
    }
    return c;
}

/**
 * Calculates the lighting at a given point with the number of reflections remaining
 * @param {World} world
 * @param {Ray} ray
 * @return {Color}
 */
function ColorAt(world, ray, remaining = 5) {
    let xs = world.Intersect(ray);
    let hit = Hit(xs);
    if (hit == undefined) return new Color(0, 0, 0);
    let comps = hit.getComputations(ray);
    return ShadeHit(world, comps, remaining);

}

/**
 * Calculates the reflected color given a set of IntersectionComputations and the number of reflections remaining
 * @param {World} world
 * @param {IntersectionComputations} comps
 * @param {number} remaining
 * @return {Color}
 */
function ReflectedColor(world, comps, remaining = 5) {
    if (remaining <= 0 || comps.object.material.reflective == 0) {
        return new Color(0, 0, 0);
    }
    let reflect_ray = new Ray(comps.over_point, comps.reflectv);
    let color = ColorAt(world, reflect_ray, remaining - 1);

    return color.MultipleScalar(comps.object.material.reflective);

}

/**
 * Calculates if the given point is in shadow relative to a given light source
 * and returns 1 if it is shadowed and 0 if it is not.
 * @param {World} world
 * @param {Point} point
 * @param {PointLight} light
 * @return {Color}
 */
function IsShadowed(world, point, light) {
    let v = light.position.Subtract(point);
    let distance = v.Magnitude();
    let direction = v.Normalize();

    let r = new Ray(point, direction);
    let intersections = world.Intersect(r);
    let h = Hit(intersections);
    if (h == undefined) return 0;
    if (h.t < distance) return 1;
    return 0;
}

/**
 * Calculates the amount that the given point is in shadow relative to a given light source.
 * returns a number between 1 (complete shadow) and 0 (no shadow) based on the proportion of
 * perturbed rays that intercepted objects.
 * @param {World} world
 * @param {Point} point
 * @param {PointLight} light
 * @return {number}
 */
function SoftShadowAmount(world, point, light) {
    let vol = light.position.Subtract(point);
    let samples = 15;
    let sampleDist = .53;
    let blockedSamples = 0;
    let vlo = vol.Normalize().Negate().Premultiply(sampleDist);
    let rad = Math.PI * 2 / samples;
    for (let i = 0; i < samples; i++) {
        let pos = vlo.Premultiply(mt.Rotation_y(90).Postmultiply(mt.Rotation_x(rad * i))).Add(light.position);
        let v = pos.Subtract(point);
        let distance = v.Magnitude();
        let direction = v.Normalize();

        let r = new Ray(point, direction);
        let intersections = world.Intersect(r);
        let h = Hit(intersections);
        if (h == undefined) blockedSamples += 0;
        else if (h.t < distance) blockedSamples++;
    }
    //return (1 / (1 + Math.sqrt(blockedSamples / samples)));
    return ((blockedSamples * blockedSamples) / (samples * samples))
}