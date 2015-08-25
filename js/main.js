var height = $('body').innerHeight(),
    width = $('body').innerWidth(),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    path = {},
    defaultAnimations = [],
    nextAnimations = [],
    sidesToAnimate = [],
    maxCols,
    maxRows,
    pause = false;

$('#canvas').attr('height', height).attr('width', width);

function pauseToggle() {
  pause = !pause;
}

function randomSide(maxRows, maxCols) {
  var randomRow = randomIntBetween(0, maxRows).toString(),
      randomColumn = randomIntBetween(0, maxCols).toString(),
      randomSide = randomIntBetween(1, 6).toString();

  return randomRow + 'x' + randomColumn + 'y' + randomSide + 'n';
}

function draw(animations) {
  ctx.clearRect(0, 0, width, height);

  var cx = 0,
      cy = 0,
      s = 40,
      apothem = (Math.sqrt(3) * s) / 2;

  maxCols = Math.floor((width/(1.5*s) + 1));
  maxRows = Math.floor((height/(2*apothem) + 1));

  defaultAnimations = [];

  for(var i = 0; i < 50; i++) {
    var randDir = randomIntBetween(1,2),
        randomDirection = (randDir === 1) ? 'ccw' : 'cw';

    defaultAnimations.push({
      side: randomSide(maxRows, maxCols),
      direction: randomDirection
    });
  }

  nextAnimations = animations ? animations : defaultAnimations;

  for(var j = 0; j < maxCols; j++) {
    if(j % 2 === 1) {
      for(var i = 0; i < maxRows; i++) {
        hex(cx + 1.5 * s * j, cy + 2 * apothem * i + apothem, s, i, j);
      }
    }
    else {
      for(var i = 0; i < maxRows; i++) {
        hex(cx + 1.5 * s * j, cy + 2 * apothem * i, s, i, j);
      }
    }
  }

  setTimeout(function() {
    if(pause === true) {
      var newestAnimations = animations;
      draw(newestAnimations);
    }
    else {
      var newestAnimations = [];
      sidesToAnimate = [];

      for(var i = 0; i < 1; i++) {
        var randSide = randomSide(maxRows, maxCols),
            randDir = randomIntBetween(1,2),
            randomDirection = (randDir === 1) ? 'ccw' : 'cw';

        newestAnimations.push({
          side: randSide,
          direction: randomDirection
        });

        sidesToAnimate.push(randSide);
      }

      for(var k = 0; k < nextAnimations.length; k++) {
        var side = nextAnimations[k].side,
            direction = nextAnimations[k].direction,
            randomNo = randomIntBetween(1,2);

        if(randomNo === 1) {
          var fork = 'left',
              next = nextSide(direction, fork, side),
              nextArray = positionArray(next),
                __x = nextArray[0],
                __y = nextArray[1];

          if(__x >= 0 && __x <= maxRows && __y >=0 && __y <= maxCols) {
            newestAnimations.push({
              side: next,
              direction: direction
            });

            sidesToAnimate.push(next);
            sidesToAnimate.push(equivalentSide(next));
          }
        }
        else {
          var fork = 'right',
              next = nextSide(direction, fork, side),
              nextArray = positionArray(next),
                __x = nextArray[0],
                __y = nextArray[1];

              if(__x >= 0 && __x <= maxRows && __y >=0 && __y <= maxCols) {
                newestAnimations.push({
                  side: next,
                  direction: direction
                });

                sidesToAnimate.push(next);
                sidesToAnimate.push(equivalentSide(next));
              }
        }
      }

      draw(newestAnimations);
    }
  }, 16);
}

function equivalentSide(side) {
  var arr = positionArray(side),
        x = arr[0],
        y = arr[1],
        n = arr[2];

  if(n === 1) {
    var posArr = (y % 2 === 1)
           ? [x, y + 1, 4]
           : [x - 1, y + 1, 4];
  }
  else if(n === 2) {
    var posArr = [x - 1, y, 5];
  }
  else if(n === 3) {
    var posArr = (y % 2 === 1)
           ? [x, y - 1, 6]
           : [x - 1, y - 1, 6];
  }
  else if(n === 4) {
    var posArr = (y % 2 === 1)
           ? [x + 1, y - 1, 1]
           : [x, y - 1, 1];
  }
  else if(n === 5) {
    var posArr = [x + 1, y, 2];
  }
  else if(n === 6) {
    var posArr = (y % 2 === 1)
           ? [x + 1, y + 1, 3]
           : [x, y + 1, 3];
  }

  return posArr[0] + 'x' + posArr[1] + 'y' + posArr[2] + 'n';
}

function hex(cx, cy, s, indexX, indexY) {
  var x = indexX.toString() + 'x',
      y = indexY.toString() + 'y';

  for(var i = 1; i < 7; i++) {
    var n = i.toString() + 'n';
    path[x+y+n] = new Path2D();
    if(i === 1) {
      path[x+y+n].moveTo(cx + s, cy + 0);
      path[x+y+n].lineTo(cx + s * Math.cos(-i * Math.PI / 3),
                 cy + s * Math.sin(-i * Math.PI / 3));
    }
    else {
      path[x+y+n].moveTo(cx + s * Math.cos(-(i-1) * Math.PI / 3),
                 cy + s * Math.sin(-(i-1) * Math.PI / 3));
      path[x+y+n].lineTo(cx + s * Math.cos(-i * Math.PI / 3),
                 cy + s * Math.sin(-i * Math.PI / 3));
    }

    if(sidesToAnimate.indexOf(x+y+n) > -1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    }
    else if(x === '0x' || y === '0y' || x === maxRows + 'x' || y === maxCols + 'y') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    }
    else if(x === '1x' || y === '1y' || x === (maxRows - 1) + 'x' || y === (maxCols - 1) + 'y') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    }
    else {
      ctx.strokeStyle = 'rgba(255,255,255, 0.2)';
    }
    ctx.stroke(path[x+y+n]);
  }


}

function nextSide(direction, fork, side) {
  var posArr = positionArray(side);
        x = posArr[0],
        y = posArr[1],
        n = posArr[2],
      _posArr = positionArray(equivalentSide(side)),
        _x = _posArr[0],
        _y = _posArr[1],
        _n = _posArr[2];

  if(direction === 'ccw') {
    var nextPosArr = (fork === 'left')
                 ? [x, y, ringAdd(n, 1, 6)]
                 : [_x, _y, ringAdd(_n, 5, 6)],
        posStr = positionString(nextPosArr);

    return (fork === 'left') ? posStr : equivalentSide(posStr);
  }
  else if(direction === 'cw') {
    var nextPosArr = (fork === 'left')
                 ? [_x, _y, ringAdd(_n, 1, 6)]
                 : [x, y, ringAdd(n, 5, 6)],
        posStr = positionString(nextPosArr);

    return (fork === 'left') ? equivalentSide(posStr) : posStr;
  }
}

function positionString(posArr) {
  return posArr[0] + 'x' + posArr[1] + 'y' + posArr[2] + 'n';
}

function positionArray(posStr) {
  var x = parseInt(posStr.split('x')[0], 10),
      y = parseInt(posStr.split('y')[0].split('x')[1], 10),
      n = parseInt(posStr.split('y')[1].split('n')[0], 10);

  return [x, y, n];
}

//modular arithmetic for hex sides 1-6
function ringAdd(x, y, base) {
    if(x + y === base) {
        return base;
    }
    else {
        return (x + y) % base;
    }
}

function randomIntBetween(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

$(document).ready(function() {
  draw();
});
