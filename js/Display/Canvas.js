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

        this.pixels = [];//this.ctx.createImageData(width, height);
        this.pixels.length = this.width * this.height;

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var pos = y * this.width + x;

                this.pixels[pos * 4 + 0] = 255; //r
                this.pixels[pos * 4 + 1] = 0; //g
                this.pixels[pos * 4 + 2] = 0; //b
                this.pixels[pos * 4 + 3] = 255;// a
            }
        }
        this.update();
    }
    /**
     * Redraw the pixel buffer to the canvas
     */
    update() {
        this.imageData.data.set(new Uint8ClampedArray(this.pixels));
        this.ctx.putImageData(this.imageData,0,0);
        /*let width = this.width;
        let height = this.height;
        let scale = this.scale;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var pos = y * width + x;

                this.ctx.fillStyle = 'rgba(' + this.pixels[pos * 4 + 0]
                    + ',' + this.pixels[pos * 4 + 1]
                    + ',' + this.pixels[pos * 4 + 2]
                    + ',' + this.pixels[pos * 4 + 3] + ')';

                this.ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }*/
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
}