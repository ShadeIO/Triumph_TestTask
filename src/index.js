import './styles.css'

const canvas = document.getElementById("polygonCanvas");
const ctx = canvas.getContext("2d");
let savedPoints = null;
let points = [];
let addingPoints = false;
let selectingFirst = false;
let selectingSecond = false; './styles.css'
let firstPoint = null;
let secondPoint = null;
let clockwise = true;

document.getElementById("createPoints").addEventListener("click", () => {
    addingPoints = true;
    points = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("pointsStatus").style.color = "white";
    document.getElementById("pointsStatus").textContent = "Click to add points";
    document.getElementById("clear").disabled = false;
    document.getElementById("createPoints").disabled = true;
});

document.addEventListener('DOMContentLoaded', loadPolygonFromLocalStorage);

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (addingPoints) {
        points.push({ x, y });
        drawPoint(x, y, `p${points.length}`);
        updateStatus();
    } else if (selectingFirst || selectingSecond) {
        let clickedPoint = findClosestPoint(x, y);
        if (clickedPoint) {
            if (selectingFirst) {
                firstPoint = clickedPoint;
                document.getElementById("firstPointLabel").textContent = `p${points.indexOf(clickedPoint) + 1}`;
            } else if (selectingSecond) {
                secondPoint = clickedPoint;
                document.getElementById("secondPointLabel").textContent = `p${points.indexOf(clickedPoint) + 1}`;
            }
            selectingFirst = false;
            selectingSecond = false;
            highlightPath();
        }
    }
});

function loadPolygonFromLocalStorage() {
    savedPoints = localStorage.getItem('polygonPoints');
    if (savedPoints) {
        points = JSON.parse(savedPoints);
        for (let i = 0; i < points.length; i++) {
            drawPoint(points[i].x, points[i].y, `p${i + 1}`);
        }
        drawGraph(); // Перерисовываем загруженный полигон
        updateStatus();
        document.getElementById("firstPoint").disabled = false;
        document.getElementById("secondPoint").disabled = false;
        document.getElementById("toggleDirection").disabled = false;
        document.getElementById("clear").disabled = false;
        document.getElementById("createPoints").disabled = true;
        document.getElementById("drawPolygon").disabled = true;
        document.getElementById("clearStorage").disabled = false;
    } else document.getElementById("clearStorage").disabled = true;
}

function savePolygonToLocalStorage() {
    localStorage.setItem('polygonPoints', JSON.stringify(points));
    document.getElementById("clearStorage").disabled = false;
}

function drawPoint(x, y, label) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(label, x + 5, y - 5);
}

function updateStatus() {
    const status = document.getElementById("pointsStatus");
    status.textContent = `Created ${points.length} points`;
    status.style.color = points.length >= 3 && points.length <= 15 ? "green" : "red";
    document.getElementById("drawPolygon").disabled = points.length < 3 || points.length > 15;
}

function drawGraph() {
    if (points.length < 3) return;
    addingPoints = false;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    savePolygonToLocalStorage();
}

document.getElementById("drawPolygon").addEventListener("click", () => {
    drawGraph();
    document.getElementById("firstPoint").disabled = false;
    document.getElementById("secondPoint").disabled = false;
    document.getElementById("toggleDirection").disabled = false;
    document.getElementById("drawPolygon").disabled = true;
});

document.getElementById("firstPoint").addEventListener("click", () => {
    selectingFirst = true;
});

document.getElementById("secondPoint").addEventListener("click", () => {
    selectingSecond = true;
});

function findClosestPoint(x, y) {
    return points.find(p => Math.hypot(p.x - x, p.y - y) < 10);
}

function highlightPath() {
    if (!firstPoint || !secondPoint) return;
    clearPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    let path = [];
    let startIndex = points.indexOf(firstPoint);
    let endIndex = points.indexOf(secondPoint);
    let i = startIndex;
    while (true) {
        path.push(`p${i + 1}`);
        ctx.lineTo(points[i].x, points[i].y);
        if (i === endIndex) break;
        i = clockwise ? (i + 1) % points.length : (i - 1 + points.length) % points.length;
    }
    ctx.stroke();
    document.getElementById("pathOutput").textContent = `Path: ${path.join(" - ")}`;
}

function clearPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        drawPoint(points[i].x, points[i].y, `p${i + 1}`);
    }
    drawGraph();
}

document.getElementById("clear").addEventListener("click", () => {
    points = [];
    addingPoints = false;
    selectingFirst = false;
    selectingSecond = false;
    firstPoint = null;
    secondPoint = null;
    clockwise = true;
    const status = document.getElementById("pointsStatus");
    document.getElementById("createPoints").disabled = false;
    document.getElementById("drawPolygon").disabled = true;
    document.getElementById("firstPoint").disabled = true;
    document.getElementById("secondPoint").disabled = true;
    document.getElementById("clear").disabled = true;
    document.getElementById("toggleDirection").disabled = true;
    document.getElementById("firstPointLabel").textContent = `None`;
    document.getElementById("secondPointLabel").textContent = `None`;
    document.getElementById("toggleDirection").textContent = "Clockwise";
    document.getElementById("pathOutput").textContent = "Path: None";
    if (savedPoints == null) {
        document.getElementById("clearStorage").disabled = true;
    }
    status.textContent = "Click to add points";
    status.style.color = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("toggleDirection").addEventListener("click", () => {
    clockwise = !clockwise;
    document.getElementById("toggleDirection").textContent = clockwise ? "Clockwise" : "Counterclockwise";
    highlightPath();
});

document.getElementById('clearStorage').addEventListener('click', () => {
    savedPoints = null;
    localStorage.removeItem('polygonPoints');
    document.getElementById("pathOutput").textContent = `Storage cleared!`;
    document.getElementById("clearStorage").disabled = true;
    //points = [];
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
});