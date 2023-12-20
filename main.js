// Light and Dark Mode

let _mode = 'light';

const themeIconEl = document.getElementById('themeIcon');
themeIconEl.onclick = () => toggleMode()

function toggleMode() {
  switch (_mode) {
    case 'light':
      _mode = 'dark';
      themeIconEl.setAttribute('src', './sun.svg');
      break;
    case 'dark':
      _mode = 'light';
      themeIconEl.setAttribute('src', './moon.svg');
      break;
    default:
      break;
  }

  const root = document.querySelector(':root');
  root.style.setProperty('--background-color',
    getComputedStyle(root).getPropertyValue(`--${_mode}-bg`));
  root.style.setProperty('--font-color',
    getComputedStyle(root).getPropertyValue(`--${_mode}-font`));
  root.style.setProperty('--accent-color',
    getComputedStyle(root).getPropertyValue(`--${_mode}-accent`));
}

// Bin Hex Dec Conversion

const UPPER_HEX_MAP = {
  'a': 10,
  'b': 11,
  'c': 12,
  'd': 13,
  'e': 14,
  'f': 15
}

let _numBits = 0;
let _twosComp = false;

const numBitsEl = document.getElementById('numBits');
numBitsEl.oninput = () => syncValues('decimal');

const twosCompEl = document.getElementById('twosComp');
twosCompEl.oninput = () => syncValues('decimal');

const decimalEl = document.getElementById('decimal');
decimalEl.oninput = () => syncValues('decimal');

const hexEl = document.getElementById('hex');
hexEl.oninput = () => syncValues('hex');

const binaryEl = document.getElementById('binary');
binaryEl.oninput = () => syncValues('binary');

function syncValues(from) {
  _numBits = parseInt(numBitsEl.value);
  _twosComp = twosCompEl.checked;

  switch (from) {
    case 'decimal':
      let val = decimalEl.value ? parseInt(decimalEl.value) : 0;
      hexEl.value = _twosComp ? parseInt(toBinFromSignedDec(val), 2).toString(16) : val >= 0 ? val.toString(16) : 0;
      binaryEl.value = _twosComp ? toBinFromSignedDec(val) : val >=0 ? val.toString(2) : 0;
      break;
    case 'hex':
      let hexBinVal = hexEl.value ? parseInt(hexEl.value, 16).toString(2) : '';
      decimalEl.value = _twosComp ? toSignedDecFromBin(hexBinVal) : hexBinVal ? parseInt(hexBinVal, 2) : 0;
      hexEl.value = hexEl.value ? hexEl.value : '';
      binaryEl.value = hexBinVal;
      break;
    case 'binary':
      let binVal = binaryEl.value;
      decimalEl.value = _twosComp ? toSignedDecFromBin(binVal) : binVal ? parseInt(binVal, 2) : 0;
      hexEl.value = binVal ? parseInt(binVal, 2).toString(16) : '';
    default:
      break;
  }
}

function toSignedDecFromBin(val) {
  if (val.length > _numBits) {
    return 0;
  }

  val = val.padStart(_numBits, '0');
  const reversed = val.split('').toReversed().join('');

  let num = 0;
  if (reversed[_numBits - 1] == '1') {
    num -= Math.pow(2, _numBits - 1);
  }

  for (let i = _numBits - 2; i >= 0; i--) {
    let add = reversed[i] >= 10 && 2 === 16 ? UPPER_HEX_MAP[reversed[i]] : parseInt(reversed[i], 2);
    num += add * Math.pow(2, i);
  }

  return num;
}

function toBinFromSignedDec(val) {
  if (val > Math.pow(2, _numBits - 1) - 1 || val < -1 * Math.pow(2, _numBits - 1)) {
    return '0';
  }

  val = parseInt(val);
  let num = 0;
  let binArr = [];
  if (val < 0) {
    num = -1 * Math.pow(2, _numBits - 1);
    binArr.push('1');
  } else {
    binArr.push('0');
  }

  for (let i = _numBits - 2; i >= 0; i--) {
    if (num + Math.pow(2, i) <= val) {
      binArr.push('1');
      num += Math.pow(2, i);
    } else {
      binArr.push('0');
    }
  }

  return binArr.join('');
}