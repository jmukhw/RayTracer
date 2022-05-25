export {
    Shape, Sphere, GlassSphere, Plane, Cube, Cylinder, PointLight, Material, PatternStriped,
    PatternGradient, PatternRing, PatternChecker, PatternBlended,
    Camera
}
import * as mo from "../Operations/MatrixOps.js"
import * as so from "../Operations/ShapeOps.js"
import * as mt from "../Operations/MatrixTrans.js"
import * as int from "../Operations/Intersections.js"
import { Color } from "./Color.js";
import { Point, Ray, Vector, Intersection } from "./Touple.js";


class Shape {
    /**
     * An abstract shape class with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix
     * @param {Matrix} transform
     * @param {Material} material
     */
    constructor(transform, material) {
        if (globalThis.rtuid == undefined) {
            globalThis.rtuid = 0;
        } else { globalThis.rtuid++; }
        this.uid = globalThis.rtuid;
        if (transform == undefined) transform = mo.Get4x4IdentityMatrix();
        this.transform = transform;
        if (material == undefined) material = new Material();
        this.material = material;
    }
    /**
    * Set the sphere's 4x4 transformation matrix
    * @param {Matrix} transform
    */
    SetTransform(transform) {
        this.transform = transform;
    }
    /**
     * Test the intersection of this shape with a ray. Converts the ray to the object's local space, then calls the child's LocalIntersect 
     * function
     * @param {Ray} ray
     */
    Intersect(ray) {
        let local_ray = ray.Transform(this.transform.Invert());
        this.saved_ray = local_ray;
        return this.LocalIntersect(local_ray);
    }
    /**
     * Test the intersection of this shape with a ray. Takes a ray that has already been transformed to the object's space. Must be overridden by
     * each child class.
     * @param {Ray} ray
     */
    LocalIntersect(ray) {
        throw new Error("LocalIntersect called for abstract shape class with id (" + this.uid + "). Did you forget to override it?");
    }
    /**
     * Calculates the normal of the shape at a given point in world space. Converts the point to object space, then calls LocalNormalAt with it. 
     * it then converts the local normal into world coordinates.
     * @param {Point} point
     */
    NormalAt(point) {
        let local_point = this.transform.Invert().Premultiply(point);
        let local_normal = this.LocalNormalAt(local_point);
        let world_normal = mo.MatrixTranspose(this.transform.Invert()).Premultiply(local_normal);
        world_normal.w = 0;
        world_normal = world_normal.Normalize();
        return world_normal;
    }
    /**
     * Returns the normal at a given point that has already been transformed to the object's space. Must be overridden by
     * each child class.
     * @param {Point} point
     */
    LocalNormalAt(point) {
        return point.AsVector();
        //throw new Error("LocalNormalAt called for abstract shape class with id (" + this.uid + "). Did you forget to override it?");
    }
}

class Sphere extends Shape {
    /**
     * A sphere with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix
     * @param {Matrix} transform
     * @param {Material} material
     */
    constructor(transform, material) {
        super(transform, material);
    }
    /**
     * Test the intersection of this sphere with a ray. Takes a ray that has already been transformed to the object's space.
     * @param {Ray} ray
     */
    LocalIntersect(ray) {
        let sphere_to_ray = ray.o.Subtract(new Point(0, 0, 0));
        let a = ray.d.Dot(ray.d);
        let b = 2 * ray.d.Dot(sphere_to_ray);
        let c = sphere_to_ray.Dot(sphere_to_ray) - 1;
        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return [];
        let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        return int.Intersections(new Intersection(t1, this), new Intersection(t2, this));
    }
    /**
     * Returns the normal at a given point of that has already been transformed to the object's space. 
     * @param {Point} point
     */
    LocalNormalAt(point) {
        return point.Subtract(new Point(0, 0, 0)).AsVector();
    }

}
class GlassSphere extends Sphere {
    /**
     * A sphere with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix. Has a glass-like material.
     * @param {Matrix} transform
     * @param {Material} material
     */
    constructor(transform, material) {
        if (material == undefined) {
            material = new Material();
            material.transparency = 1;
            material.refractive_index = 1.5;
        }
        super(transform, material);
    }
}

class Plane extends Shape {
    /**
     * A plane with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix
     * @param {Matrix} transform
     */
    constructor(transform, material) {
        super(transform, material);
    }
    /**
     * Test the intersection of this plane with a ray. Takes a ray that has already been transformed to the object's space.
     * @param {Ray} ray
     */
    LocalIntersect(ray) {
        if (Math.abs(ray.d.y) < .001) {
            return [];
        }
        let t = -ray.o.y / ray.d.y;
        return int.Intersections(new Intersection(t, this));
    }
    /**
     * Returns the normal at a given point of that has already been transformed to the object's space. 
     * @param {Point} point
     */
    LocalNormalAt(point) {
        return new Vector(0, 1, 0);
    }
}

class Cube extends Shape {
    /**
     * A cube with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix
     * @param {Matrix} transform
     */
    constructor(transform, material) {
        super(transform, material);
    }
    /**
     * Test the intersection of this cube with a ray. Takes a ray that has already been transformed to the object's space.
     * @param {Ray} ray
     */
    LocalIntersect(ray) {
        let xres = this.CheckAxis(ray.o.x, ray.d.x);
        let yres = this.CheckAxis(ray.o.y, ray.d.y);
        let zres = this.CheckAxis(ray.o.z, ray.d.z);

        let xtmin = xres[0];
        let xtmax = xres[1];

        let ytmin = yres[0];
        let ytmax = yres[1];

        let ztmin = zres[0];
        let ztmax = zres[1];

        let tmin = Math.max(xtmin, ytmin, ztmin);
        let tmax = Math.min(xtmax, ytmax, ztmax);

        if (tmin > tmax) return [];

        return int.Intersections(new Intersection(tmin, this), new Intersection(tmax, this));

    }
    /**
     * Helper function for LocalIntersect that calculates the points of intersection on two parallel planes. Origin and 
     * direction are the compentents of the given point and vector. e.g., origin = ray.origin.x; direction = ray.direction.x 
     * @param {number} origin 
     * @param {number} direction 
     */
    CheckAxis(origin, direction) {
        let tmin_numerator = (-1 - origin);
        let tmax_numerator = (1 - origin);
        let tmin, tmax;

        if (Math.abs(direction) >= .0001) {
            tmin = tmin_numerator / direction;
            tmax = tmax_numerator / direction;
        } else {
            tmin = tmin_numerator * Infinity;
            tmax = tmax_numerator * Infinity;
        }

        if (tmin > tmax) {
            let temp = tmin;
            tmin = tmax;
            tmax = temp;
        }

        return [tmin, tmax];
    }
    /**
     * Returns the normal at a given point of that has already been transformed to the object's space. 
     * @param {Point} point
     */
    LocalNormalAt(point) {
        let maxc = Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z));

        if (maxc == Math.abs(point.x)) return new Vector(point.x, 0, 0);
        if (maxc == Math.abs(point.y)) return new Vector(0, point.y, 0);
        return new Vector(0, 0, point.z);
    }
}

class Cylinder extends Shape {
    /**
     * A cylinder with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix; min and max refer to coordinates on the
     * y-axis in object space of the bottom and top of the cylinder

     * @param {Matrix} transform
     * @param {Material} material
     * @param {number} min
     * @param {number} max
     */
    constructor(transform, material, min = -Infinity, max = Infinity, closed = false) {
        super(transform, material);
        this.minimum = min;
        this.maximum = max;
        this.closed = closed;
    }
    /**
     * Test the intersection of this cylinder with a ray. Takes a ray that has already been transformed to the object's space.
     * @param {Ray} ray
     */
    LocalIntersect(r) {
        let a = r.d.x * r.d.x + r.d.z * r.d.z;
        let xs = [];

        if (Math.abs(a) > .0001) {

            let b = 2 * r.o.x * r.d.x + 2 * r.o.z * r.d.z;
            let c = r.o.x * r.o.x + r.o.z * r.o.z - 1;
            let disc = b * b - 4 * a * c;

            if (disc < 0) return [];

            let t0 = (-b - Math.sqrt(disc)) / (2 * a);
            let t1 = (-b + Math.sqrt(disc)) / (2 * a);

            if (t0 > t1) {
                let temp = t0;
                t0 = t1;
                t1 = temp;
            }



            let y0 = r.o.y + t0 * r.d.y;
            if (this.minimum < y0 & y0 < this.maximum) xs.push(new Intersection(t0, this));

            let y1 = r.o.y + t1 * r.d.y;
            if (this.minimum < y1 & y1 < this.maximum) xs.push(new Intersection(t1, this));
        }
        xs = this.IntersectCaps(r, xs);


        return int.Intersections(...xs);

    }
    /**
     * Returns the normal at a given point of that has already been transformed to the object's space. 
     * @param {Point} point
     */
    LocalNormalAt(point) {
        let dist = point.x * point.x + point.z * point.z;

        if (dist < 1 && point.y >= this.maximum - 0.000001) return new Vector(0, 1, 0);
        else if (dist < 1 && point.y <= this.minimum + .000001) return new Vector(0, -1, 0);
        return new Vector(point.x, 0, point.z);
    }
    /**
     * return true if intersection at t is within radius of 1 of y axis (circle)
     * @param {Ray} ray
     * @param {number} t
     */
    CheckCap(ray, t) {
        let x = ray.o.x + t * ray.d.x;
        let z = ray.o.z + t * ray.d.z;
        return (x * x + z * z) <= 1;
    }
    /**
     * Takes an array of intersections and adds any cap intersections to it
     * @param {Ray} ray
     * @param {Intersections} xs
     */
    IntersectCaps(ray, xs) {
        if (!this.closed || Math.abs(ray.d.y) < .00001) return xs;

        let t = (this.minimum - ray.o.y) / ray.d.y;
        if (this.CheckCap(ray, t)) xs.push(new Intersection(t, this));

        t = (this.maximum - ray.o.y) / ray.d.y;
        if (this.CheckCap(ray, t)) xs.push(new Intersection(t, this));

        return xs;
    }


}

class PointLight {
    /**
     * A point light with a position and intensity
     * @param {Color} intensity
     * @param {Point} position
     */
    constructor(intensity, position) {
        this.intensity = intensity;
        this.position = position;
    }
}

class Material {
    /**
     * A material with color, ambient, diffuse, specular, and shininess properties.
     * @param {Color} color
     * @param {number} ambient
     * @param {number} diffuse
     * @param {number} specular
     * @param {number} shininess
     * @param {Pattern} pattern
     * @param {number} reflective
     */
    constructor(color, ambient = 0.1, diffuse = 0.9, specular = 0.9, shininess = 200.0, pattern = null, reflective = 0, transparency = 0, refractive_index = 1) {
        if (color == undefined) color = new Color(1, 1, 1);
        this.color = color;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.pattern = pattern;
        this.reflective = reflective;
        this.transparency = transparency;
        this.refractive_index = refractive_index;
    }
}

class Pattern {
    /**
     * Patterns are properties of the material object that return color as a function of position
     */
    constructor(transform) {
        if (transform == undefined) transform = mo.Get4x4IdentityMatrix();
        this.transform = transform;
    }
    /**
     * Returns the color at a given point in world space on an object. Transforms to object and 
     * then pattern space, then calls LocalColorAt adn returns the result.
     * @param {Point} point
     * @param {Shape} shape
     */
    ColorAt(point, shape) {
        let object_point = shape.transform.Invert().Premultiply(point);
        let pattern_point = this.transform.Invert().Premultiply(object_point);
        return this.LocalColorAt(pattern_point);
    }
    /**
     * Returns the color at a given point in object space. Should be overridden by children of the Pattern class
     * @param {Point} point
     */
    LocalColorAt(point) {
        return new Color(1, 0, 1);
    }

}
class PatternStriped extends Pattern {
    /**
     * A striped pattern which alternates between colors a and b as:
     * floor(point.x) % 2 == 0 ? a : b
     * @param {Color} a
     * @param {Color} b
     */
    constructor(a, b, transform = undefined) {
        super(transform);
        this.a = a;
        this.b = b;
    }
    /**
     * Returns the color at a given point as:
     * floor(point.x) % 2 == 0 ? a : b
     * Should not be called directly, rather call ColorAt which transforms
     * the point from world to pattern space and calls this in turn.
     * @param {Point} point
     */
    LocalColorAt(point) {
        return Math.floor(point.x) % 2 == 0 ? this.a : this.b;
    }
}
class PatternGradient extends Pattern {
    /**
     * A gradient pattern which transitions from color a to b.
     * @param {Color} a
     * @param {Color} b
     */
    constructor(a, b, transform = undefined) {
        super(transform);
        this.a = a;
        this.b = b;
    }
    /**
     * Returns a gradient pattern
     * @param {Point} point
     */
    LocalColorAt(point) {
        let offset = 1;
        let x = point.x + offset;
        let r = this.b.r - this.a.r;
        let g = this.b.g - this.a.g;
        let b = this.b.b - this.a.b;
        let frac = x - Math.floor(x + Math.sign(x) == -1 ? 1 : 0);

        return new Color(this.a.r + r * frac,
            this.a.g + g * frac,
            this.a.b + b * frac);
    }
}

class PatternRing extends Pattern {
    /**
     * A ring pattern which transitions from color a to b.
     * @param {Color} a
     * @param {Color} b
     */
    constructor(a, b, transform = undefined) {
        super(transform);
        this.a = a;
        this.b = b;
    }
    /**
     * Returns a ring pattern
     * @param {Point} point
     */
    LocalColorAt(point) {
        return Math.floor(Math.sqrt(point.x * point.x + point.y * point.y)) % 2 == 0 ? this.a : this.b;
    }
}

class PatternChecker extends Pattern {
    /**
     * A checker pattern which transitions from color a to b.
     * @param {Color} a
     * @param {Color} b
     */
    constructor(a, b, transform = undefined) {
        super(transform);
        this.a = a;
        this.b = b;
    }
    /**
     * Returns a checker pattern
     * @param {Point} point
     */
    LocalColorAt(point) {
        return (Math.floor(point.x) + Math.floor(point.y) + Math.floor(point.z)) % 2 == 0 ? this.a : this.b;
    }
}

class PatternBlended extends Pattern {
    /**
     * A pattern that blends two different patterns
     * @param {Pattern} a
     * @param {Pattern} b
     */
    constructor(a, b, transform = undefined) {
        super(transform);
        this.a = a;
        this.b = b;
    }
    /**
     * Returns a blended pattern
     * @param {Point} point
     */
    LocalColorAt(point) {
        let ca = this.a.LocalColorAt(this.a.transform.Invert().Premultiply(point));
        let cb = this.b.LocalColorAt(this.b.transform.Invert().Premultiply(point));
        return new Color((ca.r + cb.r) / 2, (ca.g + cb.g) / 2, (ca.b + cb.b) / 2);
    }
}
class Camera {
    /**
     * Create a camera where hsize and vsize are the horizontal and vertical size of the canvas in pixels. Field of view is the angle (in radians) of the view.
     * @param {number} hsize
     * @param {number} vsize
     * @param {number} field_of_view
     */
    constructor(hsize, vsize, field_of_view, aperture_size = .01) {
        this.hsize = hsize;
        this.vsize = vsize;
        this.field_of_view = field_of_view;
        this.aperture_size = aperture_size;
        this.transform = mo.Get4x4IdentityMatrix();

        this.half_view = Math.tan(field_of_view / 2);
        this.aspect = hsize / vsize;
        if (this.aspect >= 1) {
            this.half_width = this.half_view;
            this.half_height = this.half_view / this.aspect;
        } else {
            this.half_width = this.half_view * this.aspect;
            this.half_height = this.half_view;
        }
        this.pixel_size = (this.half_width * 2) / hsize;
        this.canvas = [];
        this.canvas.length = hsize * vsize;

        let bgcolor = new Color(.69, .69, .420);
        for (let y = 0; y < this.vsize - 1; y++) {
            for (let x = 0; x < this.hsize - 1; x++) {
                this.SetPixel(x, y, bgcolor);
            }
        }
    }
    /**
     * Returns a new Ray that starts at the camera and passes through the indicated x, y pixel on the canvas.
     * @param {number} x
     * @param {number} y
     */
    RayForPixel(x, y) {
        let xoff = (x + .5) * this.pixel_size;
        let yoff = (y + .5) * this.pixel_size;

        let xworld = this.half_width - xoff;
        let yworld = this.half_height - yoff;

        let pixel = this.transform.Invert().Premultiply(new Point(xworld, yworld, -1));
        let origin = this.transform.Invert().Premultiply(new Point(0, 0, 0));
        let direction = pixel.Subtract(origin).Normalize();

        return new Ray(origin, direction);
    }
    /**
     * Returns a new Ray that starts at the camera perturbed by distance and rotation values to
     * simulate an apeture and passes through the indicated x, y pixel on the canvas.
     * @param {number} x
     * @param {number} y
     * @param {number} radians
     * @param {number} dist
     */
    RayForPixelAperture(x, y, radians, dist) {
        let xoff = (x + .5) * this.pixel_size;
        let yoff = (y + .5) * this.pixel_size;

        let xworld = this.half_width - xoff;
        let yworld = this.half_height - yoff;

        let pixel = this.transform.Invert().Premultiply(new Point(xworld, yworld, -1));
        let origin = this.transform.Invert().Premultiply(new Point(Math.cos(radians) * dist, Math.sin(radians) * dist, 0));
        let direction = pixel.Subtract(origin).Normalize();

        return new Ray(origin, direction);
    }

    /**
     * Renders the given World object and returns a 1-dimensional array of length hsize*vsize 
     * filled with Color objects for each pixel. Can specify number of anti-aliasing samples,
     * which are computed as a series of rays in a ring around each pixel; 8-12 produces a nice 
     * result
     * @param {World} world
     * @param {number} samples
     */
    Render(world, samples = 0, xmin = 0, xmax = undefined, ymin = 0, ymax = undefined) {
        if (xmax == undefined) xmax = this.hsize - 1;
        if (ymax == undefined) ymax = this.vsize - 1;
        for (let y = ymin; y < ymax; y++) {
            for (let x = xmin; x < xmax; x++) {
                let sampleDist = .5;
                let color = so.ColorAt(world, this.RayForPixel(x, y));
                let sampleWeight = 1;
                for (let n = 0; n < samples; n++) {
                    let rad = Math.PI * 2 / (n / samples);
                    let xoff = sampleDist * Math.cos(rad);
                    let yoff = sampleDist * Math.sin(rad);
                    let ray = this.RayForPixel(x + xoff, y + yoff);
                    let sampleColor = so.ColorAt(world, ray);
                    sampleColor.MultipleScalar(sampleWeight);
                    color = color.Add(sampleColor);
                }
                color = color.MultipleScalar(1 / (samples * sampleWeight + 1));
                this.SetPixel(x, y, color);
            }
        }
        return this.canvas;
    }

    /**
     * Renders the given World object and returns a 1-dimensional array of length hsize*vsize 
     * filled with Color objects for each pixel. Can specify number of samples, which are computed 
     * as a series of rays from random locations within the apeture. The apeture is simulated by
     * generating two pseudorandom numbers: one from a gaussian distribution with a mean of 0 and
     * standard deviation equal to the "apeture distance" divided by 4, the other from a uniform
     * distribution. The gaussian and uniform values are used as polar coordinates to offset the
     * ray origin.  
     * 
     * @param {World} world
     * @param {number} samples
     * @param {function} rnd
     */
    RenderWithApeture(world, samples, rnd) {
        let sampleWeight = .75;
        for (let y = 0; y < this.vsize - 1; y++) {
            for (let x = 0; x < this.hsize - 1; x++) {
                let color = so.ColorAt(world, this.RayForPixel(x, y));
                for (let n = 0; n < samples; n++) {
                    let radians = Math.random() * Math.PI * 2;
                    let dist = rnd() * this.aperture_size * .25;

                    let ray = this.RayForPixelAperture(x, y, radians, dist);
                    let sampleColor = so.ColorAt(world, ray);
                    sampleColor.MultipleScalar(sampleWeight);
                    color = color.Add(sampleColor);
                }
                color = color.MultipleScalar(1 / (samples * sampleWeight + 1));
                this.SetPixel(x, y, color);
            }
        }
        return this.canvas;
    }
    /**
     * Gets the pixel Color object for the given x and y from the canvas object
     * @param {number} x
     * @param {number} y
     */
    GetPixel(x, y) {
        return this.canvas[y * this.vsize + x];
    }
    /**
     * Sets the pixel Color object for the given x and y from the canvas object
     * @param {number} x
     * @param {number} y
     * @param {Color} color
     */
    SetPixel(x, y, color) {
        this.canvas[y * this.vsize + x] = color;
    }
}