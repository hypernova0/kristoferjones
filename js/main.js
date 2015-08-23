var height = $('body').innerHeight(),
    width = $('body').innerWidth(),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    path = {},
    defaultAnimations = [],
    nextAnimations = [],
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
      apothem = (Math.sqrt(3) * s) / 2,
      maxCols = Math.floor((width/(1.5*s) + 1)),
      maxRows = Math.floor((height/(2*apothem) + 1));


  defaultAnimations = [];

  for(var i = 0; i < 50; i++) {
    defaultAnimations.push(randomSide(maxRows, maxCols));
  }
  //defaultAnimations = ['0x3y5n'];
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


      for(var k = 0; k < nextAnimations.length; k++) {

        var side = nextAnimations[k],
            x = parseInt(side.split('x')[0], 10),
            y = parseInt(side.split('y')[0].split('x')[1], 10),
            n = parseInt(side.split('y')[1].split('n')[0], 10),
            randomNo = randomIntBetween(1,2);

        if(randomNo === 1) {
          var fork = 'left',
              next = nextSide('ccw', fork, side);

          newestAnimations.push(next);
          //newestAnimations.push(equivalentSide(next));
        }
        else {
          var fork = 'right',
              next = nextSide('ccw', fork, side);

          newestAnimations.push(next);
          //newestAnimations.push(equivalentSide(next));
        }

        /*if(randomNo === 1) {
          var newX = x,
              newY = y,
              newN = (n === 5) ? 6 : (n + 1) % 6;

          newestAnimations.push(newX.toString() + 'x' +
                                newY.toString() + 'y' +
                                newN.toString() + 'n');
        }
        else if(randomNo === 2) {
          console.log('GNS: ' + x + 'x' + y + 'y' + n + 'n');
          var posArr = getNextSide(n, x, y, n),
              newX = posArr[0],
              newY = posArr[1],
              newN = ringAdd5(n);
          console.log(posArr);
          newestAnimations.push(newX.toString() + 'x' +
                                newY.toString() + 'y' +
                                newN.toString() + 'n');
        }
        else if(randomNo === 3) {
          var posArr = getNextSide(ringAdd5(n), x, y, ringAdd5(n)),
              newX = posArr[0];
              newY = posArr[1];
              newN = ringAdd4(posArr[2]),
              nextSide = newX.toString() + 'x' +
                         newY.toString() + 'y' +
                         newN.toString() + 'n';

          newestAnimations.push(nextSide);
          newestAnimations.push(equivalentSide(nextSide));
        }*/

      }

      draw(newestAnimations);
    }
  }, 50);
}

function equivalentSide(side) {
  var x = parseInt(side.split('x')[0], 10),
      y = parseInt(side.split('y')[0].split('x')[1], 10),
      n = parseInt(side.split('y')[1].split('n')[0], 10);

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
    //x+y+n === '1x16y5n'
    if(nextAnimations.indexOf(x+y+n) > -1) {
      ctx.strokeStyle = 'rgb(255, 0, 0)';
    }
    else {
      ctx.strokeStyle = 'rgba(0,0,0, 0.1)';
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
                 ? [x, y, ringAdd1(n)]
                 : [_x, _y, ringAdd5(_n)],
        posStr = positionString(nextPosArr);

    return (fork === 'left') ? posStr : equivalentSide(posStr);
  }
  else if(direction === 'cw') {
    var nextPosArr = (fork === 'left')
                 ? [_x, _y, ringAdd1(_n)]
                 : [x, y, ringAdd5(n)],
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

function getNextSide(index, x, y, n) {
  if(index === 1) {
    return y % 2 === 1
           ? [x - 1, y, ringAdd5(n)]
           : [x - 1, y, ringAdd5(n)];
  }
  else if(index === 2) {
    return y % 2 === 1
           ? [x, y - 1, ringAdd5(n)]
           : [x - 1, y - 1, ringAdd5(n)];
  }
  else if(index === 3) {
    return y % 2 === 1
           ? [x + 1, y - 1, ringAdd5(n)]
           : [x, y - 1, ringAdd5(n)];
  }
  else if(index === 4) {
    return y % 2 === 1
           ? [x + 1, y, ringAdd5(n)]
           : [x + 1, y, ringAdd5(n)];
  }
  else if(index === 5) {
    return y % 2 === 1
           ? [x + 1, y + 1, ringAdd5(n)]
           : [x, y + 1, ringAdd5(n)];
  }
  else if(index === 6) {
    return y % 2 === 1
           ? [x, y + 1, ringAdd5(n)]
           : [x - 1, y + 1, ringAdd5(n)];
  }
}

function ringAdd1(n) {
  if(n === 5) {
    return 6;
  }
  else {
    return (n + 1) % 6;
  }
}

function ringAdd5(n) {
  if(n === 1) {
    return 6;
  }
  else {
    return (n + 5) % 6;
  }
}

function ringAdd4(n) {
  if(n === 2) {
    return 6;
  }
  else {
    return (n + 4) % 6;
  }
}

function ringAdd2(n) {
  if(n === 4) {
    return 6;
  }
  else {
    return (n + 2) % 6;
  }
}

function randomIntBetween(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

$(document).ready(function() {
  draw();
});
