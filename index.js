const width = 125;
const height = 125;

setDocDimensions(width, height);

// store final lines here
const lines = [];

// bt.setRandSeed(12345);

// Testing star
// const t = 6;
// for (let i = 0; i < t; i++) {
//   let x = [rect(30, 30, 45, 40)];
//   bt.rotate(x, i*360/t)
//   lines.push(x[0]);
// }

// let a = [rect(30, 30, 45, 40)];
// let b = [rect(30, 40, 45, 40)];
// drawLines(a);
// drawLines(b);

// Draw a rectangle at x, y of width w and height h
function rect(w, h, x = 0, y = 0) {
  return [
    [-w/2 + x, h/2 + y],
    [-w/2 + x, -h/2 + y],
    [w/2 + x, -h/2 + y],
    [w/2 + x, h/2 + y],
    [-w/2 + x, h/2 + y],
  ]
}

function randomQRArray() {
  const array = [];
  const rows = 21;
  const cols = 21;
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.round(bt.rand())); // Randomly push 0 or 1
        }
        array.push(row);
    }
    
    return array;
}
// Currently a random array
const finalQRArray = randomQRArray();

// Output QR code qrArray
// console.log(finalQRArray
//             .map(row => row.map(val => val == 0 ? ' ' : '■')
//                             .join(' ')
//                 )
//             .join('\n')
//            );

const s = height/finalQRArray.length;
for(let y = 0; y < finalQRArray.length; y++) {
  for (let x = 0; x < finalQRArray[y].length; x++) {
    const val = finalQRArray[y][x];
    if (val) {
      let a = [rect(s, s, s*x + s/2, height- s*y - s/2)];
      
      lines.push(a[0]);
    }
  }
}

// bt.rotate(lines, 180)
// bt.rotate(lines, 180);
// bt.scale(lines, -1, [width/2, height/2]);

drawLines(lines, {'fill': '#000000'});
