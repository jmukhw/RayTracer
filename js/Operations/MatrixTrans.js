export {Translation,
        Scaling}

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
