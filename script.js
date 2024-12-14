//---------------------------OPERATOR--------------------------------------------------------
function complexExp(theta) {
    return {
        real: Math.cos(theta),
        imag: Math.sin(theta)
    };
}
const U12 = [
[complexExp(Math.PI / 4), { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
[{ real: 0, imag: 0 }, complexExp(Math.PI / 4), { real: 0, imag: 0 }, { real: 0, imag: 0 }],
[{ real: 0, imag: 0 }, { real: 0, imag: 0 }, complexExp(-Math.PI / 4), { real: 0, imag: 0 }],
[{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, complexExp(-Math.PI / 4)]
];

const U23 = [
[{ real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: -1 }],
[{ real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: -1}, { real: 0, imag: 0 }],
[{ real: 0, imag: 0 }, { real: 0, imag: 1 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }],
[{ real: 0, imag: 1 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }]
];

const U34 = [
[complexExp(Math.PI / 4), { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
[{ real: 0, imag: 0 }, complexExp(-Math.PI / 4), { real: 0, imag: 0 }, { real: 0, imag: 0 }],
[{ real: 0, imag: 0 }, { real: 0, imag: 0 }, complexExp(Math.PI / 4), { real: 0, imag: 0 }],
[{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, complexExp(-Math.PI / 4)]
];

function elementAsVector(a) {
return [parseFloat(a.real), parseFloat(a.imag)];
}

function vectorToString(v) {
let result = "";
// case: both vector elements are zero
if (Math.abs(v[0]) < 1e-15 && Math.abs(v[1]) < 1e-15) {
    result = "0";
}
// case: real part is zero
else if (Math.abs(v[0]) < 1e-15) {
    if (v[1] === 1) {
        result += "i";
    } else if (v[1] === -1) {
        result += "-i";
    } else {
        result += `${Number.isInteger(v[1]) ? Math.round(v[1]) : v[1]}i`;
    }
}
// case: imaginary part is zero
else if (Math.abs(v[1]) < 1e-15) {
    result += `${Number.isInteger(v[0]) ? Math.round(v[0]) : v[0]}`;
}
// case: both real and imaginary parts are whole numbers
else if (Number.isInteger(v[0]) && Number.isInteger(v[1])) {
    // case: both real and imaginary parts are positive
    if (v[0] > 0 && v[1] > 0) {
        result += `${Math.round(v[0])}+${Math.round(v[1])}i`;
    }
    // case: real part is positive and imaginary part is negative
    else if (v[0] > 0 && v[1] < 0) {
        result += `${Math.round(v[0])}-${Math.round(Math.abs(v[1]))}i`;
    }
    // case: real part is negative and imaginary part is positive
    else if (v[0] < 0 && v[1] > 0) {
        result += `-${Math.round(Math.abs(v[0]))}+${Math.round(v[1])}i`;
    }
}

if (result !== "") return result;

// else: result is in the form a*e^(i*theta)
const angle = Math.atan2(v[1], v[0]);
const magnitude = Math.sqrt(v[0] ** 2 + v[1] ** 2);

// convert angle to multiples of pi if possible
const argument = angle / Math.PI;

if (magnitude !== 1) result += `${Number.isInteger(magnitude) ? Math.round(magnitude) : magnitude}`;
if (argument < 0) {
    result += `e^{-i\\frac{\\pi}{${Math.round(1 / Math.abs(argument))}}}`;
} else {
    result += `e^{i\\frac{\\pi}{${Math.round(1 / Math.abs(argument))}}}`;
}

return result;
}

function matrixToString(U) {
const result = [];
for (let row of U) {
    result.push(row.map(a => vectorToString(elementAsVector(a))));
}
return result;
}

function multiplyComplex(c1, c2) {
        const realPart = c1.real * c2.real - c1.imag * c2.imag;
        const imagPart = c1.real * c2.imag + c1.imag * c2.real;
        return { real: realPart, imag: imagPart };
    }

// dot product of two matrices
function matrixMultiply(A, B) {
        const result = [];
        for (let i = 0; i < A.length; i++) {
            result.push([]);
            for (let j = 0; j < B[0].length; j++) {
                // Initialize the sum for the (i, j) element
                let sum = { real: 0, imag: 0 };

                // Perform the sum of the products of corresponding elements
                for (let k = 0; k < A[0].length; k++) {
                    const product = multiplyComplex(A[i][k], B[k][j]);
                    sum.real += product.real;
                    sum.imag += product.imag;
                }

                // Store the result
                result[i].push(sum);
            }
        }
        return result;
    }

function symbolicMatrixToLatex(matrix) {
    let latex = '\\begin{bmatrix}';
    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i];
        latex += row.join(' & ');
        if (i < matrix.length - 1) {
            latex += ' \\\\ ';
        }
    }
    latex += '\\end{bmatrix}';
    return latex;
}

let previous_matrix = [
    [{ real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
    [{ real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
    [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }],
    [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }]
];

document.addEventListener("DOMContentLoaded", function() {
    // Now the element with id "matrix" should exist
    document.getElementById("exchange-matrix").innerHTML = symbolicMatrixToLatex(matrixToString(previous_matrix));
    MathJax.typeset();
});



//---------------------------ANIMATION--------------------------------------------------------
// Parameters
const N = 4; // Number of Majoranas
const L = 10; // Length of the screen

// Create SVG canvas
const svg = d3.select("#animation")
    .append("svg")
    .attr("width", L * 50)
    .attr("height", L * 25);

const centerX = L * 25;
const centerY = L * 12.5;

// Helper function to create lines
function createLine(x1, y1, x2, y2, color, width) {
    svg.append("line")
        .attr("x1", x1 * 50)
        .attr("y1", centerY - y1 * 50)
        .attr("x2", x2 * 50)
        .attr("y2", centerY - y2 * 50)
        .attr("stroke", color)
        .attr("stroke-width", width);
}

// Create the fixed gray lines
createLine(1, 0.5, 9, 0.5, "gray", 2);

for (let i = 1; i <= 4; i++) {
    createLine(i * 2 - 0.55, -0.5, i * 2 + 0.55, -0.5, "gray", 2);
}
createLine(1, -0.5, 1.65, -0.5, "gray", 2);
createLine(8.35, -0.5, 9, -0.5, "gray", 2);

for (let i = 2; i <= 4; i++) {
    createLine(i * 2 - 0.55, -0.5, i * 2 - 0.55, -1.5, "gray", 2);
}
for (let i = 1; i < 4; i++) {
    createLine(i * 2 + 0.55, -0.5, i * 2 + 0.55, -1.5, "gray", 2);
}

// Initialize Majoranas
const majoranas = [];
let currentPositions = [];
let indexMapping = Array.from({ length: N }, (_, i) => i); // Tracks logical indices to physical positions
const colors = ["#ADD8E6", "#00008B", "#FFA500", "#FF0000"];

// Initial positions
for (let i = 0; i < N; i++) {
    const x = (L / (N + 1)) * (i + 1);
    const y = 0;
    currentPositions.push([x, y]);

    const circle = svg.append("circle")
        .attr("cx", x * 50)
        .attr("cy", centerY - y * 50)
        .attr("r", 15)
        .attr("fill", colors[i])
        .attr("stroke", "black");

    majoranas.push(circle);
}

// Function to calculate trajectories for exchanging neighbors
function exchangeNeighbors(i, j) {
    const trajectoryI = [];
    const trajectoryJ = [];
    const physicalI = indexMapping[i];
    const physicalJ = indexMapping[j];
    const initI = currentPositions[physicalI];
    const initJ = currentPositions[physicalJ];
    const noSteps = Math.floor((L / (N + 1)) * 20);

    // Move i rightwards
    for (let k = 0; k < noSteps / 4; k++) {
        const xI = initI[0] + (L / (2 * (N + 1))) * (k / (noSteps / 4));
        trajectoryI.push([xI, 0]);
        trajectoryJ.push(initJ);
    }

    // Move i downward
    for (let k = noSteps / 4; k < noSteps / 2; k++) {
        const xI = initI[0] + L / (2 * (N + 1));
        const yI = -1 * ((k - noSteps / 4) / (noSteps / 4));
        trajectoryI.push([xI, yI]);
        trajectoryJ.push(initJ);
    }

    // Move j to initI
    for (let k = noSteps / 2; k < noSteps; k++) {
        const xJ = initJ[0] + (initI[0] - initJ[0]) * ((k - noSteps / 2) / (noSteps / 2));
        trajectoryI.push(trajectoryI[trajectoryI.length - 1]);
        trajectoryJ.push([xJ, 0]);
    }

    // Move i to y = 0
    for (let k = 0; k < noSteps / 4; k++) {
        const xI = trajectoryI[trajectoryI.length - 1][0];
        const yI = trajectoryI[trajectoryI.length - 1][1] + (0 - trajectoryI[trajectoryI.length - 1][1]) * (k / (noSteps / 4));
        trajectoryI.push([xI, yI]);
        trajectoryJ.push(trajectoryJ[trajectoryJ.length - 1]);
    }

    // Move i to initJ
    for (let k = 0; k < noSteps / 4; k++) {
        const xI = trajectoryI[trajectoryI.length - 1][0] + (initJ[0] - trajectoryI[trajectoryI.length - 1][0]) * (k / (noSteps / 4));
        trajectoryI.push([xI, 0]);
        trajectoryJ.push(trajectoryJ[trajectoryJ.length - 1]);
    }

    return [trajectoryI, trajectoryJ, physicalI, physicalJ];
}

// Start the animation
function startExchange() {
    const i = parseInt(document.getElementById("i").value);
    const j = parseInt(document.getElementById("j").value);

    if (isNaN(i) || isNaN(j) || i < 0 || j < 0 || i >= N || j >= N || Math.abs(i - j) !== 1) {
        alert("Unesite indekse susjednih majorana!");
        return;
    }

    const [trajectoryI, trajectoryJ, physicalI, physicalJ] = exchangeNeighbors(i, j);

    const totalFrames = trajectoryI.length;

    function update(frame) {
        if (frame < totalFrames) {
            majoranas[physicalI]
                .attr("cx", trajectoryI[frame][0] * 50)
                .attr("cy", centerY - trajectoryI[frame][1] * 50);
            majoranas[physicalJ]
                .attr("cx", trajectoryJ[frame][0] * 50)
                .attr("cy", centerY - trajectoryJ[frame][1] * 50);
        }
    }

    let frame = 0;
    const interval = setInterval(() => {
        if (frame < totalFrames) {
            update(frame);
            frame++;
        } else {
            clearInterval(interval);

            // Update current positions and index mapping
            [currentPositions[physicalI], currentPositions[physicalJ]] = [currentPositions[physicalJ], currentPositions[physicalI]];
            [indexMapping[i], indexMapping[j]] = [indexMapping[j], indexMapping[i]];
        }
    }, 50);

    // Update the exchange matrix
    if(i === 0 && j === 1 || i===1 && j ===0) {
        previous_matrix = matrixMultiply(U12, previous_matrix);
    } else if(i === 1 && j === 2 || i===2 && j ===1) {
        previous_matrix = matrixMultiply(U23, previous_matrix);
    }
    else if(i === 2 && j === 3 || i===3 && j ===2) {
        previous_matrix = matrixMultiply(U34, previous_matrix);
    }
    document.getElementById("exchange-matrix").innerHTML = symbolicMatrixToLatex(matrixToString(previous_matrix));
    MathJax.typeset(); 

}