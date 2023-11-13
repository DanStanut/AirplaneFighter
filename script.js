const ctx = document.getElementById("gameCanvas").getContext("2d");
const img = new Image();

const planeSpeed = 1;
const planeMove = 1;

function drawGame(canvasY, planeX) {

}

function drawStart() {
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.font = "36px ROG Fonts";
        ctx.fillStyle = "#f2efce";
        ctx.fillText("Wellcome!", 70, 200);
        ctx.font = "24px ROG Fonts";
        ctx.fillText("Controlls:", 110, 300);
        ctx.fillText("Arrow keys: move", 50, 336);
        ctx.fillText("Space: fire", 110, 372);
        ctx.fillText("Press space to start", 10, 500);
    }
    img.src = "Images/Background.png";
}
