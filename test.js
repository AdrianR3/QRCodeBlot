const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);
for (let exponent = 1, value = 1; exponent < 256; exponent++) {
  value = value > 127 ? ((value << 1) ^ 285) : value << 1;
  LOG[value] = exponent % 255;
  EXP[exponent % 255] = value;
}

function mul(a, b) {
  return a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0;
}
function div(a, b) {
  return EXP[(LOG[a] + LOG[b] * 254) % 255];
}


function polyMul(poly1, poly2) {
  const coeffs = new Uint8Array(poly1.length + poly2.length - 1);
  for (let index = 0; index < coeffs.length; index++) {
    let coeff = 0;
    for (let p1index = 0; p1index <= index; p1index++) {
      const p2index = index - p1index;
      coeff ^= mul(poly1[p1index], poly2[p2index]);
    }
    coeffs[index] = coeff;
  }
  return coeffs;
}

function polyRest(dividend, divisor) {
  const quotientLength = dividend.length - divisor.length + 1;
  let rest = new Uint8Array(dividend);
  for (let count = 0; count < quotientLength; count++) {
    // If the first term is 0, we can just skip this iteration
    if (rest[0]) {
      const factor = div(rest[0], divisor[0]);
      const subtr = new Uint8Array(rest.length);
      subtr.set(polyMul(divisor, [factor]), 0);
      rest = rest.map((value, index) => value ^ subtr[index]).slice(1);
    } else {
      rest = rest.slice(1);
    }
  }
  return rest;
}

function getGeneratorPoly(degree) {
  let lastPoly = new Uint8Array([1]);
  for (let index = 0; index < degree; index++) {
    lastPoly = polyMul(lastPoly, new Uint8Array([1, EXP[index]]));
  }
  return lastPoly;
}

// console.log(
//   getGeneratorPoly(8)
// )

function multiplyPolynomials(coeffs1, coeffs2) {
    const result = new Array(coeffs1.length + coeffs2.length - 1).fill(0);
    
    for (let i = 0; i < coeffs1.length; i++) {
        for (let j = 0; j < coeffs2.length; j++) {
          // result[i + j] += (coeffs1[i]) * coeffs2[j];  
          result[i + j] ^= (EXP[coeffs1[i] % 255]) ^ EXP[coeffs2[j % 255]];
            // result[i + j] = result[i + j] % 255;
        }
    }
    
    return result;
}

function multiplyBinomials(a, b) {
  return [a[0] * b[0], a[0] * b[1] + a[1] * b[0], a[1] * b[1]];
}

function polynomialMultiplication(n) {
    // Start with the polynomial 1 (constant term)
    let result = [1];
    
    // Multiply by each polynomial (x - a^i)
    for (let i = 0; i < n; i++) {
        // Current polynomial (x - a^i)
        const currentPolynomial = [1, -Math.pow(1, i)]; // (x - a^i), with a^i = 1
        
        // Multiply the result with the current polynomial
        result = multiplyPolynomials(result, currentPolynomial);
    }
    
    return result;
}

const n = 7;
const coefficients = polynomialMultiplication(n);

// console.log(coefficients); // Output the coefficients of the final polynomial
// console.log(multiplyBinomials([1, 2], [1, 2]))
console.log(multiplyPolynomials([0, 25, 1], [0, 2]))
