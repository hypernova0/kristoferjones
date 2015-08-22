var height = $('body').innerHeight(),
    width = $('body').innerWidth(),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    path = {},
    defaultAnimations = [],
    nextAnimations = [];

$('#canvas').attr('height', height).attr('width', width);

function draw(animations) {
  ctx.clearRect(0, 0, width, height);

  var cx = 0,
      cy = 0,
      s = 40,
      apothem = (Math.sqrt(3) * s) / 2,
      maxCols = Math.floor((width/(1.5*s) + 1)),
      maxRows = Math.floor((height/(2*apothem) + 1)),
      randomRow = randomIntBetween(0, maxRows).toString(),
      randomColumn = randomIntBetween(0, maxCols).toString(),
      randomSide = randomIntBetween(1, 6).toString();

  defaultAnimations = [randomRow + 'x' + randomColumn + 'y' + randomSide + 'n'];
  nextAnimations = animations ? animations : defaultAnimations;

  console.log(nextAnimations);

  keyHexSide = randomRow + 'x' + randomColumn + 'y' + randomSide + 'n';

  for(var j = 0; j < maxCols; j++) {
    if(j % 2 === 1) {
      for(var i = 0; i < maxRows; i++) {
        hex(cx + 1.5 * s * j, cy + 2 * apothem * i - apothem, s, i, j);
      }
    }
    else {
      for(var i = 0; i < maxRows; i++) {
        hex(cx + 1.5 * s * j, cy + 2 * apothem * i, s, i, j);
      }
    }
  }


}

function hex(cx, cy, s, indexX, indexY) {
  var x = indexX.toString() + 'x',
      y = indexY.toString() + 'y';


  for(var i = 1; i < 7; i++) {
    var n = i.toString() + 'n';
    path[x+y+n] = new Path2D();
    if(i === 1) {
      path[x+y+n].moveTo(cx + s, cy + 0);
      path[x+y+n].lineTo(cx + s * Math.cos(i * Math.PI / 3),
                 cy + s * Math.sin(i * Math.PI / 3));
    }
    else {
      path[x+y+n].moveTo(cx + s * Math.cos((i-1) * Math.PI / 3),
                 cy + s * Math.sin((i-1) * Math.PI / 3));
      path[x+y+n].lineTo(cx + s * Math.cos(i * Math.PI / 3),
                 cy + s * Math.sin(i * Math.PI / 3));
    }
    if(nextAnimations.indexOf(x+y+n) > -1) {
      ctx.strokeStyle = 'rgb(255, 0, 0)';
    }
    else {
      ctx.strokeStyle = 'rgba(0,0,0, 0.1)';
    }
    ctx.stroke(path[x+y+n]);
  }


}

function randomIntBetween(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

$(document).ready(function() {
  draw();
});
