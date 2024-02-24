const canvas = document.getElementById("main-canvas")
const ctx = canvas.getContext("2d")

// Utils
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

let player = {
    pos_x: 0,
    pos_y: 0,
    orientation: 0.0,
    speed: 290,
}

let projectiles = [];

let enemies = [];
let enemySpawnRate = 4.0;
let lastEnemySpawnTime = 0.0
const enemySize = 35;

let lastFrameTime = 0.0;
let spacePressed = false;

function drawBackground() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 300;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function shoot() {
    projectiles.push({
        pos_x: player.pos_x,
        pos_y: player.pos_y,
        orientation: player.orientation,
        speed: 1000,
    });
}

function updateProjectiles(dt) {
    projectiles.forEach((projectile) => {
        const x = Math.sin(projectile.orientation);
        const y = -Math.cos(projectile.orientation);

        projectile.pos_x += x * dt * projectile.speed;
        projectile.pos_y += y * dt * projectile.speed;

        const distanceFormCenter = Math.sqrt((projectile.pos_x - canvas.width / 2) *
            (projectile.pos_x - canvas.width / 2) +
            (projectile.pos_y - canvas.height / 2) *
            (projectile.pos_y - canvas.height / 2));

        if (distanceFormCenter > 310) {
            projectiles.shift();
        }
    });
}

function drawProjectiles() {
    projectiles.forEach(projectile => {
        const radius = 10;

        ctx.beginPath();
        ctx.arc(projectile.pos_x, projectile.pos_y, radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#507fe5";
        ctx.fill();
    });
}

function spawnEnemy() {
    if ((performance.now() - lastEnemySpawnTime) / 1000 > enemySpawnRate) {
        enemies.push({
            pos_x: getRandomInt((canvas.width / 2) - 200, (canvas.width / 2) + 200),
            pos_y: getRandomInt((canvas.height / 2) - 200, (canvas.height / 2) + 200),
            speed: 100,
        });

        lastEnemySpawnTime = performance.now();
        if (enemySpawnRate > 0.5) {
            enemySpawnRate -= 0.1;
        }
    }
}

function updateEnemies(dt) {
    enemies.forEach(enemy => {
        let x = player.pos_x - enemy.pos_x;
        let y = player.pos_y - enemy.pos_y;

        x = x / Math.sqrt(x * x + y * y);
        y = y / Math.sqrt(x * x + y * y);

        enemy.pos_x += x * dt * enemy.speed;
        enemy.pos_y += y * dt * enemy.speed;
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = "#ff6b6b";
        ctx.fillRect(enemy.pos_x - enemySize / 2, enemy.pos_y + enemySize / 2, enemySize, enemySize);
    });
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

function resolveCollisions() {
    // Projectile-enemy
    projectiles.forEach(projectile => {
        enemies.forEach((enemy, index) => {
            if (Math.abs(projectile.pos_x - enemy.pos_x) < 30 && Math.abs(projectile.pos_y - enemy.pos_y) < 30) {
                projectiles.shift();
                enemies.splice(index, 1);
            }
        });
    });

    // Player-enemy
    enemies.forEach((enemy) => {
        if (Math.abs(player.pos_x - enemy.pos_x) < 30 && Math.abs(player.pos_y - enemy.pos_y) < 30) {
            window.location.replace("gameover.html");
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    drawProjectiles();
    drawEnemies();
}

function gameLoop() {
    const dt = (performance.now() - lastFrameTime) / 1000;
    lastFrameTime = performance.now();
    updatePlayer(dt);
    updateProjectiles(dt);
    updateEnemies(dt);
    spawnEnemy();
    draw();
    resolveCollisions();
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

    document.addEventListener("keydown", (e) => {
        if (e.key === " " && !spacePressed) {
            spacePressed = true;
            shoot();
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === " ") {
            spacePressed = false;
        }
    });
    window.requestAnimationFrame(gameLoop);
}
