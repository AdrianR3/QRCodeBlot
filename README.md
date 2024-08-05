# QRCodeBlot

## Helpful Tables

### QR Code Generation Parameters
This table may help select the correct values for the QR code constants. Here is an example:
```js
const encodeVersion = 2;          // https://www.thonky.com/qr-code-tutorial/character-capacities
const errorCorrectionLevel = "M"; // L (7%), M (15%), Q (25%), H (30%)
const requiredBits = 28 * 8;      // "Data Codewords" https://www.thonky.com/qr-code-tutorial/error-correction-table
const errorCorrectionBytes = 16;  // "EC Codewords Per Block" https://www.thonky.com/qr-code-tutorial/error-correction-table
```
A full table can be found by visiting [Thonky.com's QR Tutorial](https://www.thonky.com/qr-code-tutorial/error-correction-table).
|Version (`encodeVersion`)|EC Level (`errorCorrectionLevel`)|Data Codewords (`requiredBits * 8`)|EC Codewords (`errorCorrectionBytes`)|
|-------|--------|--------------|------------|
|1      |L       |19            |7           |
|1      |M       |16            |10          |
|1      |Q       |13            |13          |
|1      |H       |9             |17          |
|2      |L       |34            |10          |
|2      |M       |28            |16          |
|2      |Q       |22            |22          |
|2      |H       |16            |28          |
|3      |L       |55            |15          |
|3      |M       |44            |26          |
|3      |Q       |34            |18          |
|3      |H       |26            |22          |
|4      |L       |80            |20          |
|4      |M       |64            |18          |
|4      |Q       |48            |26          |
|4      |H       |36            |16          |
