// Parameters
const N = 4; // Number of Majoranas
const L = 10; // Length of the screen

// Create SVG canvas
const svg = d3.select("#animation")
    .append("svg")
    .attr("width", L * 50)  // Resize to half the original width
    .attr("height", L * 25)  // Resize to half the original height
    .style("background-color", "white");

const centerX = L * 25;
const centerY = L * 12.5;

// Helper function to create lines
function createLine(x1, y1, x2, y2, color, width) {
    svg.append("line")
        .attr("x1", x1 * 50)  // Resize to half the original width
        .attr("y1", centerY - y1 * 50) // Flip the Y values
        .attr("x2", x2 * 50)  // Resize to half the original width
        .attr("y2", centerY - y2 * 50) // Flip the Y values
        .attr("stroke", color)
        .attr("stroke-width", width);
}

// Create the fixed gray lines
createLine(1, 0.5, 9, 0.5, "gray", 2);

for (let i = 1; i <= 4; i++) {
    createLine(i * 2 - 0.35, -0.5, i * 2 + 0.35, -0.5, "gray", 2);
}

for (let i = 2; i <= 4; i++) {
    createLine(i * 2 - 0.35, -0.5, i * 2 - 0.35, -1.5, "gray", 2);
}
for (let i = 1; i < 4; i++) {
    createLine(i * 2 + 0.35, -0.5, i * 2 + 0.35, -1.5, "gray", 2);
}

// Initialize Majoranas
const majoranas = [];
const initPositions = [];
const colors = ["red", "yellow", "green", "blue"];

for (let i = 0; i < N; i++) {
    const x = (L / (N + 1)) * (i + 1);
    const y = 0;
    initPositions.push([x, y]);

    const circle = svg.append("circle")
        .attr("cx", x * 50)  // Resize to half the original width
        .attr("cy", centerY - y * 50)  // Flip the Y value
        .attr("r", 15)  // Resize the radius to half the original size
        .attr("fill", colors[i])
        .attr("stroke", "black");

    majoranas.push(circle);
}

// Function to calculate trajectories for exchanging neighbors
function exchangeNeighbors(i, j) {
    const trajectoryI = [];
    const trajectoryJ = [];
    const initI = initPositions[i];
    const initJ = initPositions[j];
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

    return [trajectoryI, trajectoryJ];
}

// Function to calculate trajectories for exchanging any two Majoranas
function exchange(i, j) {
    if (i > j) [i, j] = [j, i];

    const trajectories = initPositions.map(pos => [pos.slice()]);

    const sequence = [];
    if (j === i) return trajectories;
    if (j === i + 1) {
        sequence.push([i, j]);
    } else if (j === i + 2) {
        sequence.push([i, i + 1], [i, j], [i + 1, j]);
    } else if (j === i + 3) {
        sequence.push([i, i + 1], [i + 2, j], [i, j], [i, i + 2], [i + 1, j]);
    } else {
        throw new Error("Invalid exchange");
    }

    for (const [k, l] of sequence) {
        const [trajK, trajL] = exchangeNeighbors(k, l);

        for (let t = 0; t < trajK.length; t++) {
            for (let m = 0; m < N; m++) {
                if (m === k) {
                    trajectories[m].push(trajK[t]);
                } else if (m === l) {
                    trajectories[m].push(trajL[t]);
                } else {
                    trajectories[m].push(trajectories[m][trajectories[m].length - 1]);
                }
            }
        }

        [initPositions[k], initPositions[l]] = [initPositions[l], initPositions[k]];
    }

    return trajectories;
}

// Start exchange when button is clicked
function startExchange() {
    const i = parseInt(document.getElementById("i").value, 10);
    const j = parseInt(document.getElementById("j").value, 10);

    // Reset Majoranas to their original positions
    const originalPositions = [
        [(L / (N + 1)) * 1, 0],
        [(L / (N + 1)) * 2, 0],
        [(L / (N + 1)) * 3, 0],
        [(L / (N + 1)) * 4, 0]
    ];

    for (let idx = 0; idx < N; idx++) {
        initPositions[idx] = [...originalPositions[idx]]; // Reset initPositions
        majoranas[idx]
            .attr("cx", originalPositions[idx][0] * 50)
            .attr("cy", centerY - originalPositions[idx][1] * 50);
    }

    // Calculate new trajectories for the current exchange
    const trajectories = exchange(i, j);

    // Animate the exchange
    const totalFrames = trajectories[0].length;

    function update(frame) {
        for (let idx = 0; idx < N; idx++) {
            const traj = trajectories[idx];
            if (frame < traj.length) {
                majoranas[idx]
                    .attr("cx", traj[frame][0] * 50)
                    .attr("cy", centerY - traj[frame][1] * 50);
            }
        }
    }

    let frame = 0;
    const interval = setInterval(() => {
        if (frame < totalFrames) {
            update(frame);
            frame++;
        } else {
            clearInterval(interval);
        }
    }, 40); // Update every 40ms
}
