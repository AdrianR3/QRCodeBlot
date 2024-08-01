const width = 125;
const height = 125;

let version = 7;
let size = 4 * version + 17;

setDocDimensions(width, height);

// store final lines here
const lines = [];

// bt.setRandSeed(12345);

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
    // Generate Alignment Patterns
    function alignmentPattern(x, y) {
      x-=2;
      y-=2;
        for (let i = 0; i <= 4; i++) {
            for (let j = 0; j <= 4; j++) {
                if (i == 0 || i == 4 || j == 0 || j == 4 || (i == 2 && j == 2)) {
                    setBlock(x + i, y + j, 1);
                } else {
                    setBlock(x + i, y + j, 0);
                }
            }
        }
    }

  
    // Finder patterns
    // (Three big rings)
    drawFinderPattern(0, 0);
    drawFinderPattern(0, size - 7);
    drawFinderPattern(size - 7, 0);

    // Separator Rings 
    // (Dark rings around the finder patterns)
    separatorRing(-1, -1);
    separatorRing(-1, size-8);
    separatorRing(size-8, -1);

    // Alignment Patterns
    if (version > 1) {
      const coords = getPossibleAlignmentCoords(version);
      // Add alignment patterns
      for (let cyi = 0; cyi < coords.length; cyi++) {
        for (let cxi = 0; cxi < coords.length; cxi++) {
          let x = coords[cxi];
          let y = coords[cyi];
          console.log(`${x}, ${y}, ${matrix[y][x]}`)
          if (matrix[y][x] == 3) {
            alignmentPattern(coords[cxi], coords[cyi])
          }
        }
      }
    }

    // Timing Patterns
    // (Alternating black and white stripes)
    for (let i = 7; i < size - 7; i++) {
        // Vertical Timing Pattern
        setBlock(i, 6, !(i % 2));

        // Horizontal Timing Pattern
        setBlock(6, i, !(i % 2));
    }

    return matrix;
}

// Big Thanks to StackOverflow
function getPossibleAlignmentCoords(version) {
  if (version === 1) {
    return [];
  }
  const intervals = Math.floor(version / 7) + 1;
  const distance = 4 * version + 4; // between first and last alignment pattern
  const step = Math.ceil(distance / intervals / 2) * 2; // To get the next even number
  return [6].concat(Array.from(
    { length: intervals },
    (_, index) => distance + 6 - (intervals - 1 - index) * step)
  );
}

console.log(`Version: ${version}`)
console.log(getPossibleAlignmentCoords(version))

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

let baseArray = randomArray(size);
baseArray = Array.from({ length: size }, () => Array(size).fill(3));
let finalQRArray = generateQRCode(version, baseArray);

// Output QR code qrArray
console.log(finalQRArray.map(row => row.map(val => val == 0 ? ' ' : val == 3 ? '⋅' : '■').join(' '))
            .join('\n')
           );

// Convert QR Code Array into rectangles for drawing
let renderEmpty = false;
const s = height/finalQRArray.length;
for(let y = 0; y < finalQRArray.length; y++) {
  for (let x = 0; x < finalQRArray[y].length; x++) {
    const val = finalQRArray[y][x];
    if (val == 1) {
      let a = [rect(s, s, s*x + s/2, height- s*y - s/2)];
      lines.push(a[0]);
    } else if (val == 3) {
      let a = [rect(s/3, s/3, s*x + s/2, height- s*y - s/2)];
      bt.rotate(a, 45)
      lines.push(a[0]);
    } else if (renderEmpty) {
      let a = [rect(s/4, s/4, s*x + s/2, height- s*y - s/2)];
      lines.push(a[0]);
    }
  }
}

drawLines(lines, {'fill': '#FF0000'});
