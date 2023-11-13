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
        ctx.fillText("Wellcome!", 60, 200);
        ctx.font = "24px ROG Fonts";
        ctx.fillText("Controlls:", 110, 300);
    }
    img.src = "Images/Background.png";
}
