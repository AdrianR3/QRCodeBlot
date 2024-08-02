const width = 125;
const height = 125;

// This controls whether you are looking at a preset or a randomly generated piece
// Randomly Generated: 0

// Try Presets 1 - 5
const PRESET = 0;
const maxVersion = 10;

let random = [
  bt.randIntInRange(1, maxVersion), 
  bt.randIntInRange(1, 20), 
  12345, 
  bt.randIntInRange(1, 8+2),
  '#FF0000',
  0
];

const presets = [
    random,
    [5, 20, 12345, 5, '#FF0000', 0], // Preset 1
    [12, 1, 12345, 6, '#FFFFFF', 0], // Preset 2
    [1, 0, 12345, 5, undefined, 0], // Preset 3
    [1, 1, 12345, 8, undefined, 0], // Preset 4
    [-1, 5, 1333, 5, '#FF0000', 0], // Preset 5
]

let strokeWidth = getPresets()[1];
let version = getPresets()[0]
let seed = getPresets()[2];

let size = 4 * version + 17;
const lines = [];

setDocDimensions(width, height);

if (PRESET != 0) bt.setRandSeed(seed);

function getPresets() {
  // Version (1-40), Stroke Width, Seed, Mask, Fill, Data to Use (0-2)

  if (bt.rand() < 0.05 && random[0] < 6) random[4] = undefined;
  if (random[0] < random[1]) random[1] = bt.randIntInRange(1, random[1] / 2);

  if (random[3] >= 8) random[5] = 1;

  
  if (PRESET == 0) console.log(presets[0]);

  if (PRESET >= presets.length) return [-1, 0, 0, 0, '#000000'];
  return presets[PRESET];
}

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



function circle(r, x, y) {
  const t = new bt.Turtle();
  t.arc(360, r);
  const cc = bt.bounds(t.path).lt;
  bt.translate(t.path, [x, y], cc);

  return t.path;
}

// Helper function to convert string to binary representation
//function toBinaryArray(str) {
//    return str.split('').map(char => char.charCodeAt(0).toStseparatorRing(2).padStart(8, '0')).join('');
//}
let dataArray = emptyArray(version, -1);
function generateQRCode(
  version = 1,
  matrix
) {
    dataArray = emptyArray(version, -1);

    // Version 1 QR Code -> size = 21
    // Version 40 QR Code -> size = 177
    let size = 4 * version + 17;

    // If no predefined QR Code Array
    if (matrix == undefined) {
      matrix = Array.from({ length: size }, () => Array(size).fill(0));
    }

    // Function to set a dot in the matrix
    function setBlock(x, y, value = 1) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            matrix[y][x] = value;
        }
    }

    function setData(x, y, value = 1) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            dataArray[y][x] = value;
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

    const availablePositions = [];
    function getAvailablePositions() {
      // Collect all available positions in zigzag order
      for (let x = 0; x < size; x++) {
        let ax = size - x - 1;
        let shift = 0;

        // Skip Vertical Timing Pattern
        if (ax < 7) {
          shift = 1
        };
        
        if (ax % 4 == 0 + (shift * 3)) {
          // zigzag from bottom to top
          for (let y = size - 1; y >= 0; y--) {
            if (matrix[y][ax] == 3) {availablePositions.push({ ax, y });}
            if (matrix[y][--ax] == 3) {availablePositions.push({ ax, y });}
            ax++;
          }
        } 
        else 
          if (x % 4 == 2 + shift) {
          // zigzag from top to bottom
          for (let y = 0; y < size; y++) {
            if (matrix[y][ax] == 3) {availablePositions.push({ ax, y });}
            if (matrix[y][--ax] == 3) {availablePositions.push({ ax, y });}
            ax++;
          }
        }
      }
    }

    function setDataModule(targetIndex, dataValue) {
  
      // Check if we have enough positions
      if (targetIndex >= availablePositions.length) {
        console.error(`Target index ${targetIndex} exceeds the number of available modules.`)
        return;  
        // throw new Error("Target index exceeds the number of available modules.");
      }

      // Set the data module at next available bit
      const { ax, y } = availablePositions[targetIndex];
      setData(ax, y, dataValue)
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
          
          if (matrix[y][x] == 1) continue;
          
          alignmentPattern(x, y);
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

    // Dark Module
    setBlock(8, 4 * version + 9, 0);

    const reservedValue = 0;
    // Reserve Format Information Area
    for (let x = 0; x < size; x++) {
      if (!(x < 9 || x > size - 9)) continue;
      if (matrix[8][x] != 3) continue;
      setBlock(x, 8, reservedValue)
    }

    for (let y = 0; y < size; y++) {
      if (!(y < 9 || y > size - 9)) continue;
      if (matrix[y][8] != 3) continue;
      setBlock(8, y, reservedValue)
    }

  
    // Reserve Version Information Area
    if (version >= 7) {
      // Top Right
      for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 3; y++) {
          setBlock(x, y + size - 7 - 4, 0)
        }
      }
      
      // Bottom Left
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 6; y++) {
          setBlock(x + size - 7 - 4, y, 0)
        }
      }
    }
    
    getAvailablePositions();
    console.log(`Available Data Bits: ${availablePositions.length}`)

    // Fill Data bits
    for (let i = 0; i < availablePositions.length; i++) {
      // setDataModule(i, i+4)
      setDataModule(i, Math.round(bt.rand()))
    }

    let mask = getPresets()[3];
    const maskedArray = maskMatrix(JSON.parse(JSON.stringify(dataArray)), mask);

    applyMaskedMatrix(matrix, maskedArray);
    
    // return maskedArray;
    // return dataArray;
    return matrix;
}

function applyMaskedMatrix(baseMatrix, topMatrix) {
  for (let y = 0; y < baseMatrix.length; y++) {
    for (let x = 0; x < baseMatrix[y].length; x++) {
      let topBit = topMatrix[y][x];
      if (topBit == -1) continue;

      baseMatrix[y][x] = topBit;
    }
  }
  
  return baseMatrix;
}

function maskMatrix(matrix, mask = 0) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      let bit = matrix[y][x];
      if (bit == -1) continue;

      bit = 0
      
      matrix[y][x] = maskBit(y, x, bit, mask);
    }
  }
  
  return matrix;
}

function maskBit(row, col, bit, mask) {
  switch (Number(mask)) {
    case 0: return bit ^ ((row + col) % 2 == 0)
    case 1: return bit ^ (row % 2 == 0);
    case 2: return bit ^ (col % 3 == 0);
    case 3: return bit ^ ((row + col) % 3 == 0);
    case 4: return bit ^ ((Math.floor(row / 2) + Math.floor(col / 3)) % 2 == 0);
    case 5: return bit ^ (row * col % 2 + row * col % 3 == 0);
    case 6: return bit ^ (((row * col) % 2 + row * col % 3) % 2 == 0);
    case 7: return bit ^ (((row + col) % 2 + row * col % 3) % 2 == 0);
    default: return bit; // No Mask
  }
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

console.log(`QR Version: ${version}`)

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

function emptyArray(version, value = 0) {
    let n = 4*version + 17;
    return Array.from({ length: n }, () => Array(n).fill(value));
}

let baseArray = randomArray(size);
if (getPresets()[5] == 0) {
  baseArray = Array.from({ length: size }, () => Array(size).fill(3));
}
let finalQRArray = generateQRCode(version, baseArray);

// Output QR code qrArray
// console.log(
//   finalQRArray.map(row => row.map(val => val == 0 ? ' ' : val == 3 ? '⋅' : '■').join(' '))
//             .join('\n')
//            );

console.log(finalQRArray.map(row => 
  row.map(val => {
      let char;
      switch (Number(val)) {
          case 0:
              char = ' ';
              break;
          case 1:
              char = '■';
              break;
          case 2:
              char = 'x';
              break;
          case 3:
              char = '⋅';
              break;
          default:
              char = Number(val)-3;
              break;
      }
      return char;
  }).join(' ')
).join('\n'));

// Convert QR Code Array into rectangles for drawing
let renderEmpty = false;
const s = height/finalQRArray.length;
for(let y = 0; y < finalQRArray.length; y++) {
  for (let x = 0; x < finalQRArray[y].length; x++) {
    const val = finalQRArray[y][x];
    if (val == 1) {
      // Full Square
      // renderSquare(x, y);
      renderRounded(x, y);
      continue; // Debug
      if (dataArray[y][x] == -1) {
        renderRounded(x, y);
      } else {
        renderCircle(x, y);
      }
    } else if (val == 3) {
      // Draw Diamond
      let a = [rect(s/3, s/3, s*x + s/2, height- s*y - s/2)];
      bt.rotate(a, 45)
      lines.push(a[0]);
    } else if (val == 2) {
      // Draw 'X'
      let a = [rect(s/4, s, s*x + s/2, height- s*y - s/2)];
      let b = [rect(s/4, s, s*x + s/2, height- s*y - s/2)];
      bt.rotate(a, 45)
      bt.rotate(b, -45)
      lines.push(a[0]);
      lines.push(b[0]);
    } else if (val > 3) {
      // Draw 'X'
      let a = [rect(s/4, s, s*x + s/2, height- s*y - s/2)];
      let b = [rect(s/4, s, s*x + s/2, height- s*y - s/2)];
      bt.rotate(b, 90)
      lines.push(a[0]);
      lines.push(b[0]);
    } else if (renderEmpty) {
      // Small Square
      let a = [rect(s/4, s/4, s*x + s/2, height- s*y - s/2)];
      lines.push(a[0]);
    }
  }
}

function renderRounded(x, y) {
  let a = circle(s/2, width/size*x, height - height/size*y);
  let r = []
  // Down & Right
  if (y < size - 1 && x < size && finalQRArray[y+1][x] || finalQRArray[y][x+1]) {
    let c = [rect(s/2, s/2, s*x + 3*s/4, height- s*y - 3*s/4)];
    lines.push(c[0])
  }

  // Down & Left
  if (y < size - 1 && x < size && finalQRArray[y+1][x] || finalQRArray[y][x-1]) {
    let c = [rect(s/2, s/2, s*x + 1*s/4, height- s*y - 3*s/4)];
    lines.push(c[0])
  }

  // Up & Right
  if (y > 0 && x < size && finalQRArray[y-1][x] || finalQRArray[y][x+1]) {
    let c = [rect(s/2, s/2, s*x + 3*s/4, height- s*y - 1*s/4)];
    lines.push(c[0])
  }

  // Up & Left
  if (y > 0 && x < size && finalQRArray[y-1][x] || finalQRArray[y][x-1]) {
    let c = [rect(s/2, s/2, s*x + 1*s/4, height- s*y - 1*s/4)];
    lines.push(c[0])
  }
  
  lines.push(a[0]);
  // lines.push(r[0]);
}

function renderCircle(x, y) {
  let a = circle(s/2, width/size*x, height - height/size*y);
  lines.push(a[0]);
}

function renderSquare(x, y) {
  let a = [rect(s, s, s*x + s/2, height- s*y - s/2)];
  lines.push(a[0]);
}

// QR Quiet Zone
bt.scale(lines, finalQRArray.length/(finalQRArray.length+8))

drawLines(lines, {'fill': getPresets()[4], 'width': strokeWidth});
// 'stroke': '#FFFF00'
                 

// drawLines(circle(2, width/2, height/2), {'fill': '#FF0000'})
