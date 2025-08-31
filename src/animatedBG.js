let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let bgg = document.getElementById("bg_glow");
let w = ctx.canvas.width = window.innerWidth;
let h = ctx.canvas.height = window.innerHeight;

window.onresize = function () {
  w = ctx.canvas.width = window.innerWidth;
  h = ctx.canvas.height = window.innerHeight;
  maxHeight = h * .9
  minHeight = h * .5;
  dots = [];
  pushDots();
  ctx.globalCompositeOperation = "lighter";
};

// document.getElementById("overlay").onclick = function(){
//   hue = Math.random()*360;
//   bgg.style.background = "radial-gradient(ellipse at center, hsla("+hue+",50%,50%,.8) 0%,rgba(0,0,0,0) 100%)";
//   dots = [];
//   pushDots();
// }

let dots = [{}];
let mx = 0; let my = 0;
let md = 100;
let maxWidth = 15;
let minWidth = 2;
let maxHeight = h * .9;
let minHeight = h * .5;
let maxSpeed = 35;
let minSpeed = 6;
let hue = 230;
let hueDif = 50; // Hue +/-
let glow = 10; // Set to 0 for better performance
ctx.globalCompositeOperation = "lighter";

function pushDots(num) {
  for (let i = 1; i < md; i++) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h / 2,
      h: Math.random() * (maxHeight - minHeight) + minHeight,
      w: Math.random() * (maxWidth - minWidth) + minWidth,
      c: Math.random() * ((hue + hueDif) - (hue - hueDif)) + (hue - hueDif),
      m: Math.random() * (maxSpeed - minSpeed) + minSpeed
    });
  }
} pushDots();

function updateDotsHue() {
  const dotsCopy = JSON.parse(JSON.stringify(dots));
  for (let i = 1; i < dotsCopy.length; i++) {
    dotsCopy[i].c += 0.5;
    if (dotsCopy[i].c > 360) {
      dotsCopy[i].c = 0;
    }
  }
  dots = dotsCopy;
}

function render() {
  ctx.clearRect(0, 0, w, h);
  for (let i = 1; i < dots.length; i++) {
    ctx.beginPath();
    let grd = ctx.createLinearGradient(dots[i].x, dots[i].y, dots[i].x + dots[i].w, dots[i].y + dots[i].h);
    grd.addColorStop(.0, "hsla(" + dots[i].c + ",50%,50%,.0)");
    grd.addColorStop(.2, "hsla(" + dots[i].c + 20 + ",50%,50%,.5)");
    grd.addColorStop(.5, "hsla(" + dots[i].c + 50 + ",70%,60%,.8)");
    grd.addColorStop(.8, "hsla(" + dots[i].c + 80 + ",50%,50%,.5)");
    grd.addColorStop(1., "hsla(" + (dots[i].c + 100) + ",50%,50%,.0)");
    ctx.shadowBlur = glow;
    ctx.shadowColor = "hsla(" + (dots[i].c) + ",50%,50%,1)";
    ctx.fillStyle = grd;
    ctx.fillRect(dots[i].x, dots[i].y, dots[i].w, dots[i].h);
    ctx.closePath();
    dots[i].x += dots[i].m / 100;
    if (dots[i].x > w + maxWidth) {
      dots[i].x = -maxWidth;
      // dots.splice(i,1);
      // dots.push({
      //   x:0,
      //   y:Math.random()*h,
      //   h:Math.random()*(maxHeight-minHeight)+minHeight,
      //   w:Math.random()*(maxWidth-minWidth)+minWidth,
      //   c:Math.random()*((hue+hueDif)-(hue-hueDif))+(hue-hueDif),
      //   m:Math.random()*(maxSpeed-minSpeed)+minSpeed
      // });
    }
  } window.requestAnimationFrame(render);
}

bgg.style.background = "radial-gradient(ellipse at center, hsla(" + hue + ",50%,50%,.8) 0%,rgba(0,0,0,0) 100%)";
render();
///// slightly change the hue with time
const updateHue = () => {
  hue += 0.5;
  if (hue > 360) hue = 0;
  bgg.style.background = "radial-gradient(ellipse at center, hsla(" + hue + ",50%,50%,.8) 0%,rgba(0,0,0,0) 100%)";
  updateDotsHue();
};

// setInterval(updateHue, 100);