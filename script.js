const ctx = document.getElementById("gameCanvas").getContext("2d");
const img = new Image();

const planeSpeed = 1;
const planeMove = 1;

var myFont = new FontFace('myFont', 'Fonts/Architectype-51B0B.otf');

function drawGame(canvasY, planeX) {

}

myFont.load().then((font) => {
    document.fonts.add(font);
    console.log('Font loaded');
    drawStart();
});

function drawStart() {
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.font = "36px myFont";
        ctx.fillStyle = "#f2efce";
        ctx.fillText("Wellcome!", 60, 200);
    }
    img.src = "Images/Background.png";
}
