//game constants
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 400;
const CANVAS_HEIGHT = canvas.height = 730;
const PLANE_SIZE = 100;
const ENEMY1_SIZE = 100;
const ENEMY2_SIZE = 60;
const PROJECTILE_SPEED = 10;
const PLANE_SPEED = 2;

//loading used images
const background = loadImage("Images/Background.png");
const planeImage = loadImage("Images/Plane.png");
const projectileImage = loadImage("Images/Projectile.png");
const enemy1Image = loadImage("Images/Enemy1.png");
const enemy2Image = loadImage("Images/Enemy2.png");

//load custom font
let myFont = new FontFace('myFont', 'url(Fonts/1942-webfont.woff)');
myFont.load().then(function(font){
    document.fonts.add(font);
});

//game variables
let gameOver = true;
let projectileLaunch = false;
let BackgroundYPos = -CANVAS_HEIGHT;
let enemiesArray = [];
let numberOfEnemies = 5;
let enemiesImageArray = [enemy1Image, enemy2Image];
let enemiesSizeArray = [ENEMY1_SIZE, ENEMY2_SIZE];
let planeSpeed = PLANE_SPEED;
let lives = 3;
let score = 0;
let lastScore = 0;
let planeShift = 5;

//define game objects
class GameObject {
    constructor(size, image) {
        this.width = size;
        this.height = size;
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.x, this.y);
    }
}

class Enemy extends GameObject{
    constructor(size, image) {
        super(size, image);
        this.x = Math.floor(Math.random() * (canvas.width - this.width));
        this.y = Math.floor(Math.random() * 1000 - 1000 - this.height);
        this.speed = Math.floor(Math.random() * planeSpeed + 2);
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -ENEMY1_SIZE;
            this.x = Math.floor(Math.random() * (canvas.width - this.width));
            this.speed = Math.floor(Math.random() * planeSpeed + 2);
        }
    }
}

class Plane extends GameObject{
    constructor(image) {
        super(PLANE_SIZE, image);
        this.x = CANVAS_WIDTH / 2 - PLANE_SIZE / 2; // set plane x position at the middle of the canvas
        this.y = CANVAS_HEIGHT - PLANE_SIZE - 5; // set the plane y position to a 5 pixel offset from bottom
    }
}

class Projectile extends GameObject{
    constructor(image) {
        super(PLANE_SIZE, image);
        this.x = CANVAS_WIDTH / 2 - PLANE_SIZE / 2; // set projectile x position at the middle of the canvas
        this.y = CANVAS_HEIGHT - PLANE_SIZE - 5; // set the projectile y position to a 5 pixel offset from bottom
    }

    update() {
        this.y -= PROJECTILE_SPEED;
        if (this.y < 0) {
            this.y = CANVAS_HEIGHT - PLANE_SIZE - 5; // reset projectile onto the plane
            projectileLaunch = false;
        }
    }
}

//object variables for the game
for (let i = 0; i < numberOfEnemies; ++i) {
    let enemyType = Math.round(Math.random());
    enemiesArray.push(new Enemy(enemiesSizeArray[enemyType], enemiesImageArray[enemyType]));
}
let plane = new Plane(planeImage);
let projectile = new Projectile(projectileImage);

function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

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
    context.roundRect(5, 5, 125 , 50, [10]);
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

function resetEnemy(enemy) {
    enemy.y = -ENEMY1_SIZE;
    enemy.x = Math.floor(Math.random() * (canvas.width - enemy.width));
    enemy.speed = Math.floor(Math.random() * planeSpeed + 2);
}

function drawGame() {
    //Clear canvas and draw background
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(background, 0, BackgroundYPos);
    context.drawImage(background, 0, BackgroundYPos - 2 * CANVAS_HEIGHT);
    if (BackgroundYPos > CANVAS_HEIGHT) {
        BackgroundYPos = -CANVAS_HEIGHT;
    } else {
        BackgroundYPos += planeSpeed;
    }
    //game logic
    if (gameOver) {
        displaySpalshScreen();
    } else {
        enemiesArray.forEach(enemy => {
            if (checkColision(enemy, plane)) {
                --lives;
                resetEnemy(enemy);
            }
            if (checkColision(enemy, projectile) && projectileLaunch) {
                ++score;
                if (score % 50 === 0) {
                    ++planeSpeed;
                }
                lastScore = score;
                resetEnemy(enemy);
                projectile.y = CANVAS_HEIGHT - PLANE_SIZE - 5;
                projectileLaunch = false;
            }
            enemy.update();
            enemy.draw();
        });
        if (projectileLaunch) {
            projectile.update(); 
        }
        if (lives === 0) {
            gameOver = true;
            planeSpeed = PLANE_SPEED;
        }
        projectile.draw();
        plane.draw();
        displayInfoText();
    }
    requestAnimationFrame(drawGame);
}

function movePlane(amount) {
    plane.x += amount;
    projectile.x = plane.x;
}

addEventListener('keydown', function(e) {
    if (gameOver) {
        if (e.code === 'Space') {
            gameOver = false;
            lives = 3;
            score = 0;    
        }
    } else {
        if (e.code === 'KeyA' && plane.x > 0) {
            movePlane(-planeShift);
        }
        if (e.code === 'KeyD' && plane.x < CANVAS_WIDTH - PLANE_SIZE) {
            movePlane(planeShift);
        }
        if (e.code === 'Space') {
            projectileLaunch = true;
        }
    }
})

drawGame();