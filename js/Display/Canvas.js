export { Canvas }
import { Color } from "../Types/Color.js"

class Canvas {
    /**
     * Display object for ray tracer. It will resize the HTML canvas object. 
     * Width and height in pixels. Scale is the size in pixels of each ray tracer pixel. 
     * @param {HTMLElement} canvas
     * @param {number} width
     * @param {number} height
     * @param {number} scale
     * @param {boolean} fillScreen
     */
    constructor(canvas, width, height, scale = 1, fillScreen = false) {
        if (fillScreen) {
            width = window.window.innerWidth / scale;
            height = window.window.innerHeight / scale;

        }

        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.scale = scale;

        canvas.width = width * scale;
        canvas.height = height * scale;

        this.ctx = canvas.getContext("2d");
        this.imageData = this.ctx.getImageData(0,0,this.width, this.height);

        this.frames = [];
        this.currentFrame = 0;

        this.startNewFrame();

        this.update();
    }
    /**
     * Redraw the pixel buffer to the canvas
     */
    update() {
        this.imageData.data.set(new Uint8ClampedArray(this.pixels));
        this.ctx.putImageData(this.imageData,0,0);
    }
    displayCurrentFrame() {
        this.imageData.data.set(new Uint8ClampedArray(this.frames[this.currentFrame]));
        this.ctx.putImageData(this.imageData,0,0);
    }
    nextFrame() {
        if (this.currentFrame >= this.frames.length) this.currentFrame = 0;
        else this.currentFrame++;
    }
    startNewFrame() {
        this.pixels = [];//this.ctx.createImageData(width, height);
        this.pixels.length = this.width * this.height;

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var pos = y * this.width + x;

                this.pixels[pos * 4 + 0] = 0; //r
                this.pixels[pos * 4 + 1] = 0; //g
                this.pixels[pos * 4 + 2] = 0; //b
                this.pixels[pos * 4 + 3] = 255;// a
            }
        }
    }
    saveFrame() {
        let a = [];
        for (let i = 0; i < this.pixels.length; i++) {
            a[i] = this.pixels[i];
        }
        this.frames.push(a);
    }
    /**
     * Set a pixel at (x, y) with red, green, blue, alpha values (0-255, inclusive), with the
     * origin in the top-left corner and the y-axis inverted
     * @param {number} x
     * @param {number} y
     * @param {Color} color
     */
    setPixel(x, y, color) {
        var pos = Math.round(y) * this.width + Math.round(x);
        if (pos >= 0 & pos * 4 + 2 < this.pixels.length) {
            this.pixels[pos * 4 + 0] = color.r;
            this.pixels[pos * 4 + 1] = color.g;
            this.pixels[pos * 4 + 2] = color.b;
        }
    }
    /**
     * Set a pixel at (x, y) with red, green, blue, alpha values (0-255, inclusive), with the
     * origin in the top-left corner and the y-axis inverted
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {Color} color
     */
    setPixelRect(x,y,w,h,color) {
        x = Math.round(x);
        y = Math.round(y);

        for (let i = x; i < x+w; i++) {
            for (let j = y; j < y+h; j++) {
                var pos = Math.round(j) * this.width + Math.round(i);
                if (pos >= 0 & pos * 4 + 2 < this.pixels.length) {
                    this.pixels[pos * 4 + 0] = color.r;
                    this.pixels[pos * 4 + 1] = color.g;
                    this.pixels[pos * 4 + 2] = color.b;
                }
            }
        }
    }
    /**
     * Get a pixel at (x, y) with red, green, blue, alpha values (0-255, inclusive), with the
     * origin in the top-left corner and the y-axis inverted
     * @param {number} x
     * @param {number} y
     */
    getPixel(x, y) {
        var color = new Color();
        var pos = y * this.width + x;
        color.r = this.pixels[pos * 4 + 0];
        color.g = this.pixels[pos * 4 + 1];
        color.b = this.pixels[pos * 4 + 2];
        return color;
    }
    clearCanvas(color) {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var pos = y * this.width + x;

                this.pixels[pos * 4 + 0] = color.r; //r
                this.pixels[pos * 4 + 1] = color.g; //g
                this.pixels[pos * 4 + 2] = color.b; //b
                this.pixels[pos * 4 + 3] = 255;// a
            }
        }
        this.update();
    }
    drawLine(p0, p1, w=10, res=40) {
        let v = p1.Subtract(p0);
        let zmin = -200;
        let zmax = 200;
        for (let i = 0; i < res; i++) {
            let p2 = p0.Translate(v.x/res*i, v.y/res*i, v.z/res*i);
            
            let zcol = this.remap(p2.z,0,1,zmin, zmax);
            let c = new Color();
            c.r = Math.max(20,zcol*200);
            c.g = Math.max(20,zcol*200);
            c.b = Math.max(20,zcol*200);
            this.setPixelRect(p2.x, p2.y, Math.max(1,zcol*w), Math.max(1,zcol*w), c);
        }
    }
    remap(x, newMin, newMax, oldMin, oldMax) {
        return ((x-oldMin)/(oldMax-oldMin))*(newMax-newMin)+newMin
    }
}