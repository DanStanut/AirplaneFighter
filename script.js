const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 400;
const CANVAS_HEIGHT = canvas.height = 730;
const PLANE_SIZE = 100;
const ENEMY1_SIZE = 100;
const ENEMY2_SIZE = 60;
const PLANE_SPEED = 3;
const PLANE_SHIFT = 20;
const PROJECTILE_SPEED = 10;

// Loading used images
const background = new Image();
background.src = "Images/Background.png";
const planeImage = new Image();
planeImage.src = "Images/Plane.png";
const projectileImage = new Image();
projectileImage.src = "Images/Projectile.png";
const enemy1Image = new Image();
enemy1Image.src = "Images/Enemy1.png";
const enemy2Image = new Image();
enemy2Image.src = "Images/Enemy2.png";

let myFont = new FontFace('myFont', 'url(Fonts/1942-webfont.woff)');

myFont.load().then(function(font){
    document.fonts.add(font);
});

let gameOver = true;
let projectileLaunch = false;
let BackgroundYPos = -CANVAS_HEIGHT;
let enemyesArray = [];
let numberOfEnemies = 4;
let enemiesImageArray = [enemy1Image, enemy2Image];
let enemiesSizeArray = [ENEMY1_SIZE, ENEMY2_SIZE];
let lives = 3;
let score = 0;
let lastScore = 0;

class Enemy {
    constructor(size, image) {
        this.width = size;
        this.height = size;
        this.x = Math.floor(Math.random() * (canvas.width - this.width));
        this.y = Math.floor(Math.random() * 1000 - 1000 - this.height);
        this.image = image;
        this.speed = Math.floor(Math.random() * PLANE_SPEED + 2);
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -ENEMY1_SIZE;
            this.x = Math.floor(Math.random() * (canvas.width - this.width));
        }
    }

    draw() {
        context.drawImage(this.image, this.x, this.y);
    }
}

class Plane {
    constructor(image) {
        this.x = CANVAS_WIDTH / 2 - PLANE_SIZE / 2;
        this.y = CANVAS_HEIGHT - PLANE_SIZE - 5;
        this.width = PLANE_SIZE;
        this.height = PLANE_SIZE;
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.x, this.y);
    }
}

class Projectile {
    constructor(image) {
        this.x = CANVAS_WIDTH / 2 - PLANE_SIZE / 2;
        this.y = CANVAS_HEIGHT - PLANE_SIZE - 5;
        this.width = PLANE_SIZE;
        this.height = PLANE_SIZE;
        this.image = image;
    }

    update() {
        this.y -= PROJECTILE_SPEED;
        if (this.y < -PLANE_SIZE) {
            this.y = CANVAS_HEIGHT - PLANE_SIZE - 5;
            projectileLaunch = false;
        }
    }

    draw() {
        context.drawImage(this.image, this.x, this.y);
    }
}

//object variables for the game
for (let i = 0; i < numberOfEnemies; ++i) {
    let enemyType = Math.floor(Math.random() + 0.5);
    enemyesArray.push(new Enemy(enemiesSizeArray[enemyType], enemiesImageArray[enemyType]));
}
let plane = new Plane(planeImage);
let projectile = new Projectile(projectileImage);

function displaySpalshScreen() {
    context.fillStyle = "#145ea6";
    context.beginPath();
    context.roundRect(30, 150, 340 , 380, [10]);
    context.stroke();
    context.fill();
    context.fillStyle = "#faa300";
    context.font = "50px myFont";
    context.fillText("Wellcome!", 60, 200);
    context.font = "24px myFont";
    context.fillText("Score: " + lastScore, 130, 234);
    context.fillText("Controlls:", 130, 270);
    context.fillText("A, D: move", 130, 306);
    context.fillText("Space: fire", 120, 342);
    context.fillText("Press space to start", 40, 500);
    context.drawImage(planeImage, 150, 370);
}

function displayInfoText() {
    context.fillStyle = "#145ea6";
    context.beginPath();
    context.roundRect(5, 5, 115 , 50, [10]);
    context.stroke();
    context.fill();
    context.fillStyle = "#faa300";
    context.font = "18px myFont";
    context.fillText("Score: " + score, 10, 22);
    context.fillText("Lives: " + lives, 10, 45);
}

function checkColision(object1, object2) {
    return (object1.x + object1.width > object2.x && object1.y + object1.height > object2.y && object1.x < object2.x + object2.width)
}

function drawGame() {
    //Clear canvas and draw background
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(background, 0, BackgroundYPos);
    context.drawImage(background, 0, BackgroundYPos - 2 * CANVAS_HEIGHT);
    if (BackgroundYPos > CANVAS_HEIGHT) {
        BackgroundYPos = -CANVAS_HEIGHT;
    } else {
        BackgroundYPos += PLANE_SPEED;
    }
    //game logic
    if (gameOver) {
        displaySpalshScreen();
    } else {
        enemyesArray.forEach(enemy => {
            if (checkColision(enemy, plane)) {
                --lives;
                enemy.y = -ENEMY1_SIZE;
                enemy.x = Math.floor(Math.random() * (canvas.width - enemy.width));
                enemy.speed = Math.floor(Math.random() * PLANE_SPEED + 2);
            }
            if (checkColision(enemy, projectile) && projectileLaunch) {
                ++score;
                lastScore = score;
                enemy.y = -ENEMY1_SIZE;
                enemy.x = Math.floor(Math.random() * (canvas.width - enemy.width));
                enemy.speed = Math.floor(Math.random() * PLANE_SPEED + 2);
                projectile.y = CANVAS_HEIGHT - PLANE_SIZE - 5;
                projectileLaunch = false;
            }
            enemy.update();
            enemy.draw();
        });
        if (projectileLaunch) {
            projectile.update(); 
        }
        if (lives == 0) {
            gameOver = true;
        }
        projectile.draw();
        plane.draw();
        displayInfoText();
    }
    requestAnimationFrame(drawGame);
}

window.addEventListener('keypress', function(e) {
    if (gameOver && e.code === 'Space') {
        gameOver = false;
        lives = 3;
        score = 0;
    }
    if (!gameOver && e.code === 'KeyA' && plane.x > 0) {
        plane.x -= PLANE_SHIFT;
        projectile.x -= PLANE_SHIFT;
    }
    if (!gameOver && e.code === 'KeyD' && plane.x < CANVAS_WIDTH - PLANE_SIZE) {
        plane.x += PLANE_SHIFT;
        projectile.x += PLANE_SHIFT;
    }
    if (!gameOver && e.code === 'Space') {
        projectileLaunch = true;
    }
})

drawGame();