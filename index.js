const width = 125;
const height = 125;

const version = 1;
const size = 4 * version + 17;

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

// Helper function to convert string to binary representation
//function toBinaryArray(str) {
//    return str.split('').map(char => char.charCodeAt(0).toStseparatorRing(2).padStart(8, '0')).join('');
//}

function generateQRCode(
  version = 1,
  matrix
) {
    // version = 4;

    // Version 1 QR Code -> size = 21
    // Version 40 QR Code -> size = 177
    let size = 4 * version + 17;

    // If no predefined QR Code Array
    if (matrix == undefined) {
      matrix = Array.from({ length: size }, () => Array(size).fill(0));
    }

    // Function to set a dot in the matrix
    function setBlock(x, y, value) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            matrix[x][y] = value;
        }
    }
    // Draw the finder patterns
    function drawFinderPattern(x, y) {
        for (let i = 0; i <= 6; i++) {
            for (let j = 0; j <= 6; j++) {
                if (i == 0 || i == 6 || j == 0 || j == 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
                    setBlock(x + i, y + j, 1);
                } else {
                    setBlock(x + i, y + j, 0);
                }
            }
        }
    }
    // Draw the separator rings around the finder patterns
    function separatorRing(x, y, v = 0) {
        for (let i = 0; i < 9; i++) {
            setBlock(x, y + i, v);
            setBlock(x + 8, y + i, v);
            setBlock(x + i, y, v);
            setBlock(x + i, y + 8, v);
        }
    }

    // Finder patterns
    drawFinderPattern(0, 0);
    drawFinderPattern(0, size - 7);
    drawFinderPattern(size - 7, 0);

    // // Separator Rings around the finder patterns
    separatorRing(-1, -1);
    separatorRing(-1, size-8);
    separatorRing(size-8, -1);

    // Alignment Patterns
    if (version > 1) {
      // Add alignment patterns
      
    }

    // Timing Patterns (alternating black and white stripes)
    for (let i = 7; i < size - 7; i++) {
        setBlock(i, 5, !(i % 2));
    //     setBlock(i, 14, i % 2);
    //     setBlock(6, i, i % 2);
    //     setBlock(14, i, i % 2);
    }

    return matrix;
}
function randomArray(size = 21) {
  const array = [];
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
          if (Math.round(bt.rand())) {
            row.push(1); // Randomly push 0 or 1
          } else {
            row.push(3);
          }
            
        }
        array.push(row);
    }
    
    return array;
}

// const finalQRArray = randomArray(size);
const finalQRArray = generateQRCode(version, randomArray(size));

// Output QR code qrArray
console.log(finalQRArray
            .map(row => row.map(val => val == 0 ? ' ' : val == 3 ? '⋅' : '■')
                            .join(' ')
                )
            .join('\n')
           );

// Convert QR Code Array into rectangles for drawing
const s = height/finalQRArray.length;
for(let y = 0; y < finalQRArray.length; y++) {
  for (let x = 0; x < finalQRArray[y].length; x++) {
    const val = finalQRArray[y][x];
    if (val == 1) {
      let a = [rect(s, s, s*x + s/2, height- s*y - s/2)];
      lines.push(a[0]);
    } else if (val == 3) {
      let a = [rect(s/2, s/2, s*x + s/2, height- s*y - s/2)];
      bt.rotate(a, 45)
      lines.push(a[0]);
    } else {
      let a = [rect(s/4, s/4, s*x + s/2, height- s*y - s/2)];
      lines.push(a[0]);
    }
  }
}

drawLines(lines, {'fill': '#FF0000'});
