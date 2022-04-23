export { Sphere, PointLight, Material, Camera }
import * as mo from "../Operations/MatrixOps.js"
import * as so from "../Operations/ShapeOps.js"
import * as mt from "../Operations/MatrixTrans.js"
import * as int from "../Operations/Intersections.js"
import { Color } from "./Color.js";
import { Point, Ray } from "./Touple.js";

class Sphere {
    /**
     * A sphere with specified 4x4 transformation matrix; if transform is undefined, it will be an identity matrix
     * @param {Matrix} transform
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
     */
    constructor(color, ambient = 0.1, diffuse = 0.9, specular = 0.9, shininess = 200.0) {
        if (color == undefined) color = new Color(1, 1, 1);
        this.color = color;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
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
        let origin = this.transform.Invert().Premultiply(new Point(Math.cos(radians)*dist, Math.sin(radians)*dist, 0));
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
    Render(world, samples = 0) {
        for (let y = 0; y < this.vsize - 1; y++) {
            for (let x = 0; x < this.hsize - 1; x++) {
                let sampleDist = .75;
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
                    let radians = Math.random()*Math.PI*2;
                    let dist = rnd()*this.aperture_size;

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