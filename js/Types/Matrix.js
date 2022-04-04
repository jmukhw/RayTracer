export { Matrix }

class Matrix {
    /**
     * An m x n dimensional matrix with values represented as a 1-dimensional array
     * @param {number} rows
     * @param {number} cols
     * @param {number[]} values 
     */
    constructor(rows = 4, cols = 4, values = []) {
        while (values.length < rows*cols) values.push(0);
        while (values.length > rows*cols) values.pop(); // silently remove extra values
        this.rows = rows;
        this.cols = cols;
        this.values = values;
    }
}