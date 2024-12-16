// Importing math.js
const math = require('mathjs');

// Define the matrices
const U12 = math.matrix([
    [math.exp(math.complex(0, Math.PI / 4)), 0, 0, 0],
    [0, math.exp(math.complex(0, Math.PI / 4)), 0, 0],
    [0, 0, math.exp(math.complex(0, -Math.PI / 4)), 0],
    [0, 0, 0, math.exp(math.complex(0, -Math.PI / 4))]
]);

const U23 = math.matrix([
    [1, 0, 0, math.complex(0, 1)],
    [0, 1, math.complex(0, -1), 0],
    [0, math.complex(0, 1), 1, 0],
    [math.complex(0, 1), 0, 0, 1]
]);

const U34 = math.matrix([
    [math.exp(math.complex(0, Math.PI / 4)), 0, 0, 0],
    [0, math.exp(math.complex(0, -Math.PI / 4)), 0, 0],
    [0, 0, math.exp(math.complex(0, Math.PI / 4)), 0],
    [0, 0, 0, math.exp(math.complex(0, -Math.PI / 4))]
]);

// Define the dot product function
function dotProduct(matrix1, matrix2) {
    return math.multiply(matrix1, matrix2);
}

// Display matrix in exponential form
function displayMatrix(matrix) {
    const rows = matrix._data.length;
    const cols = matrix._data[0].length;
    const result = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const entry = matrix._data[i][j];
            row.push(math.format(entry, { notation: 'exponential', precision: 4 }));
        }
        result.push(row);
    }
    return result;
}

// Example: Display matrices in exponential form
console.log("U12 in exponential form:");
console.log(displayMatrix(U12));

console.log("U23 in exponential form:");
console.log(displayMatrix(U23));

console.log("U34 in exponential form:");
console.log(displayMatrix(U34));

// Example: Dot product
const result = dotProduct(U12, U23);
console.log("Dot product U12 * U23 in exponential form:");
console.log(displayMatrix(result));
// 