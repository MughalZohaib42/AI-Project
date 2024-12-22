const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext("2d");

const sortedCanvas = document.getElementById("sortedCanvas");
const sortedCtx = sortedCanvas.getContext("2d");
const simpleform = document.getElementById('simple-form');

const graph = {};
const positions = {};
let traversalOrder = [];


function getRandomPosition() {
    return { x: Math.random() * 700 + 50, y: Math.random() * 200 + 50 };
}

function addEdge(from, to, cost) {
    if (graph[from] === undefined) {
        graph[from] = [];
    }

    if (positions[from] === undefined) {
        positions[from] = getRandomPosition();
    }

    if (positions[to] === undefined) {
        positions[to] = getRandomPosition();
    }

    graph[from].push({ node: to, cost: cost });
    drawGraph(mainCtx, graph, positions);
}


function drawGraph(ctx, graphData, nodePositions) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    
    for (let from in graphData) {
        for (let edge of graphData[from]) {
            const to = edge.node;
            const start = nodePositions[from];
            const end = nodePositions[to];

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = "red";
            ctx.stroke();

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            ctx.fillText(edge.cost, midX, midY);
        }
    }

    for (let node in nodePositions) {
        const { x, y } = nodePositions[node];

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
        ctx.fillText(node, x - 5, y + 5);
    }
}


function bfs(start, End) {
    const visited = new Set();
    const queue = [start];
    traversalOrder = [];


    while (queue.length > 0) {
        const current = queue.shift();
        if (!visited.has(current)) {
            visited.add(current);
            traversalOrder.push(current);

            for (let neighbor of graph[current] || []) {
                if (!visited.has(neighbor.node)) {
                    queue.push(neighbor.node);
                }
            }
        }
    }
    drawSortedGraph();
}

function dfs(start) {
    const visited = new Set();
    const stack = [start];
    traversalOrder = [];

    while (stack.length > 0) {
        const current = stack.pop();
        if (!visited.has(current)) {
            visited.add(current);
            traversalOrder.push(current);

            for (let neighbor of graph[current] || []) {
                if (!visited.has(neighbor.node)) {
                    stack.push(neighbor.node);
                }
            }
        }
    }
    drawSortedGraph();
}

function uniformCostSearch(start, goal) {
    const visited = new Set();
    const queue = [{ node: start, cost: 0, path: [start] }];
    const steps = [];

    while (queue.length > 0) {
       
        queue.sort((a, b) => a.cost - b.cost);

        const current = queue.shift();
        steps.push(current);

        if (!visited.has(current.node)) {
            visited.add(current.node);

            if (current.node === goal) break;

            for (const neighbor of graph[current.node] || []) {
                queue.push({
                    node: neighbor.node,
                    cost: current.cost + neighbor.cost,
                    path: [...current.path, neighbor.node]
                });
            }
        }
        updateQueueUI(queue);
    }
    return steps;
}

// Update priority queue in UI
function updateQueueUI(queue) {
    queueList.innerHTML = '';
    for (const item of queue) {
        const li = document.createElement('li');
        li.textContent = `${item.node}: ${item.cost}`;
        queueList.appendChild(li);
    }
}

function drawSortedGraph() {
    const sortedPositions = {};
    let xOffset = 50;

    traversalOrder.forEach((node) => {
        sortedPositions[node] = { x: xOffset, y: 150 };
        xOffset += 100;
    });

    const sortedGraph = {};
    for (let i = 0; i < traversalOrder.length - 1; i++) {
        const from = traversalOrder[i];
        const to = traversalOrder[i + 1];

        if (sortedGraph[from] === undefined) {
            sortedGraph[from] = [];
        }
        sortedGraph[from].push({ node: to, cost: 1 });
    }

    drawGraph(sortedCtx, sortedGraph, sortedPositions);
}

document.getElementById("submit").addEventListener("click", () => {
    const from = document.getElementById("f-node").value.toUpperCase();
    const to = document.getElementById("n-node").value.toUpperCase();
    const cost = parseInt(document.getElementById("cost").value, 10);

    addEdge(from, to, cost);
});
//bfs
document.getElementById("bfs-button").addEventListener("click", () => {
    const start = prompt("Enter start node:").toUpperCase();
    const End = prompt('Enter goal node:').toUpperCase();
    if (start) bfs(End);
});
//dfs
document.getElementById("dfs-button").addEventListener("click", () => {
    const start = prompt("Enter start node:").toUpperCase();
    const End = prompt('Enter goal node:').toUpperCase();
    if (start) bfs(End);
});

// Start UCS
startucs.addEventListener('click', () => {
    const startNode = prompt('Enter start node:').toUpperCase();
    const goalNode = prompt('Enter goal node:').toUpperCase();
    steps = uniformCostSearch(startNode, goalNode);
    stepIndex = 0;
    interval = setInterval(visualizeStep, 1000);
});

document.getElementById("resetButton").addEventListener("click", () => {
    traversalOrder = [];
    sortedCtx.clearRect(0, 0, sortedCanvas.width, sortedCanvas.height);
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    for (let key in graph) {
        delete graph[key];
    }
    for (let key in positions) {
        delete positions[key];
    }
});
