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
const colors = ["#0000FF", "#000099", "#800080", "#4B0082"];

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
}
