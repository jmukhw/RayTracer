export {Translation,
        Scaling,
        Rotation_x,
        Rotation_y,
        Rotation_z,
        Shearing}

import { Matrix } from "../Types/Matrix.js"
import * as mo from "./MatrixOps.js" 


/**
 * Returns a 4x4 transformation matrix representing the translation by delta x, y, z
 * @param {number} dx
 * @param {number} dy
 * @param {number} dz
 * @return {Matrix}
 */
function Translation(dx,dy,dz) {
    let T = mo.Get4x4IdentityMatrix();
    T.values[0*4+3] = dx;
    T.values[1*4+3] = dy;
    T.values[2*4+3] = dz;

    return T;
}
/**
 * Returns a 4x4 transformation matrix to scale x, y, z
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {Matrix}
 */
 function Scaling(x,y,z) {
    let T = mo.Get4x4IdentityMatrix();
    T.values[0*4+0] = x;
    T.values[1*4+1] = y;
    T.values[2*4+2] = z;

    return T;
}
/**
 * Returns a 4x4 transformation matrix representing a rotation around the x axis by a specified number of radians
 * @param {number} rads
 * @return {Matrix}
 */
function Rotation_x(rads) {
    let T = mo.Get4x4IdentityMatrix();
    T.values[1*4+1] = Math.cos(rads);
    T.values[1*4+2] = -Math.sin(rads);
    T.values[2*4+1] = Math.sin(rads);
    T.values[2*4+2] = Math.cos(rads);

    return T;
}
/**
 * Returns a 4x4 transformation matrix representing a rotation around the y axis by a specified number of radians
 * @param {number} rads
 * @return {Matrix}
 */
 function Rotation_y(rads) {
    let T = mo.Get4x4IdentityMatrix();
    T.values[0*4+0] = Math.cos(rads);
    T.values[0*4+2] = Math.sin(rads);
    T.values[2*4+0] = -Math.sin(rads);
    T.values[2*4+2] = Math.cos(rads);

    return T;
}
/**
 * Returns a 4x4 transformation matrix representing a rotation around the z axis by a specified number of radians
 * @param {number} rads
 * @return {Matrix}
 */
 function Rotation_z(rads) {
    let T = mo.Get4x4IdentityMatrix();
    T.values[0*4+0] = Math.cos(rads);
    T.values[0*4+1] = -Math.sin(rads);
    T.values[1*4+0] = Math.sin(rads);
    T.values[1*4+1] = Math.cos(rads);

    return T;
}
/**
 * Returns a 4x4 transformation matrix representing a shear in which x, y, z are transformed in proportion to each other e.g., xy = 2 adds to a given x by 2*y
 * @param {number} xy
 * @param {number} xz
 * @param {number} yx
 * @param {number} yz
 * @param {number} zx
 * @param {number} zy
 * @return {Matrix}
 */
 function Shearing(xy, xz, yx, yz, zx, zy) {
    let T = mo.Get4x4IdentityMatrix();
    T.values[0*4+1] = xy; 
    T.values[0*4+2] = xz; 
    T.values[1*4+0] = yx; 
    T.values[1*4+2] = yz; 
    T.values[2*4+0] = zx; 
    T.values[2*4+1] = zy; 

    return T;
}