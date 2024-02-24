const canvas = document.getElementById("main-canvas")
const ctx = canvas.getContext("2d")

let player = {
    pos_x: 0,
    pos_y: 0,
    orientation: 0.0,
    speed: 300,
}

let lastFrameTime = 0.0;

function drawBackground() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 300;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function updatePlayer(dt) {
    const x = Math.sin(player.orientation);
    const y = -Math.cos(player.orientation);

    player.pos_x += x * dt * player.speed;
    player.pos_y += y * dt * player.speed;

    // Check if outside of bounds
    const playerDistanceFormCenter = Math.sqrt((player.pos_x - canvas.width / 2) * 
                                               (player.pos_x - canvas.width / 2) +
                                               (player.pos_y - canvas.height / 2) *
                                               (player.pos_y - canvas.height / 2));
    if (playerDistanceFormCenter > 280) {
        window.location.replace("gameover.html");
    }
}

function drawPlayer() {
    // Center point of the triangle
    let centerX = player.pos_x;
    let centerY = player.pos_y;

    // Side length of the triangle
    let sideLength = 30;

    // Orientation angle in radians (adjust as needed)
    let orientationAngle = player.orientation + 30 * (Math.PI / 180);

    // Calculate the coordinates of the three vertices of the triangle
    let x1 = centerX + sideLength * Math.cos(orientationAngle);
    let y1 = centerY + sideLength * Math.sin(orientationAngle);

    let x2 = centerX + sideLength * Math.cos(orientationAngle + (2 * Math.PI / 3));
    let y2 = centerY + sideLength * Math.sin(orientationAngle + (2 * Math.PI / 3));

    let x3 = centerX + sideLength * Math.cos(orientationAngle + (4 * Math.PI / 3));
    let y3 = centerY + sideLength * Math.sin(orientationAngle + (4 * Math.PI / 3));

    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    ctx.fillStyle = "#507fe5";
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
}

function gameLoop() {
    const dt = (performance.now() - lastFrameTime) / 1000;
    lastFrameTime = performance.now();
    updatePlayer(dt);
    draw();
    window.requestAnimationFrame(gameLoop);
}

window.onload = init;
function init() {
    player.pos_x = canvas.width / 2;
    player.pos_y = canvas.height / 2;

    canvas.addEventListener("mousemove", (e) => {
        const x = e.offsetX - player.pos_x;
        const y = e.offsetY - player.pos_y;
        let angleInRadians = Math.atan2(x, -y);
        player.orientation = angleInRadians;
    });
    window.requestAnimationFrame(gameLoop);
}
