const dict = [
  '噜',
  '咧',
  '啪',
  '哩',
  '啦',
  '波',
  '啤',
  '咯',
  '切噜',
  '切咧',
  '切啪',
  '切哩',
  '切啦',
  '切波',
  '切啤',
  '切咯',
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * @param {string} input
 * @param {boolean} randomMark
 */
function chieruEncode(input, randomMark = true) {
  const encoder = new TextEncoder();
  const uArr = encoder.encode(input);
  const resArr = [];
  uArr.forEach((num) => {
    resArr.push(Math.floor(num / 16));
    resArr.push(num % 16);
  });
  const resStrArr = resArr.map((num) => dict[num]);
  let resStr = '';
  for (let i = 0; i < resStrArr.length; i++) {
    resStr += resStrArr[i];
    if (randomMark) {
      if (i === resStrArr.length - 1) {
        resStr += '。';
      } else if (resArr[i + 1] >= 8 && getRandomInt(2) === 0) {
        resStr += ['。', '，', '？', '！', '～'][getRandomInt(5)];
      }
    }
  }
  return '切噜～' + resStr;
}

/**
 * @param {string} input
 */
function chieruDecode(input) {
  const parsedInput = input.slice(3).replace(/[^切噜啪哩啦波啤咧咯]/g, '');
  let p = 0;
  let inputArr = [];
  while (p < parsedInput.length) {
    if (parsedInput[p] === '切') {
      inputArr.push(parsedInput[p] + parsedInput[p + 1]);
      p += 2;
    } else {
      inputArr.push(parsedInput[p++]);
    }
  }
  inputArr = inputArr.map((str) => dict.indexOf(str));

  const parsedInputArr = inputArr
    .map((num, index) =>
      index % 2 === 1 ? num + inputArr[index - 1] * 16 : num,
    )
    .filter((num, index) => index % 2 === 1);
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(new Uint8Array(parsedInputArr));
}

window.onload = () => {
  document.getElementById('encryptButton').onclick = function () {
    try {
      /** @type string */
      const sourceText = document.getElementById('sourceArea').value;
      /** @type boolean */
      const enableRandomMark = document.getElementById('randomMark').checked;
      const resultText = chieruEncode(sourceText, enableRandomMark);
      document.getElementById('targetArea').value = resultText;
    } catch (error) {
      alert(error.message);
    }
  };

  document.getElementById('decryptButton').onclick = function () {
    try {
      /** @type string */
      const sourceText = document.getElementById('targetArea').value;
      if (sourceText.slice(0, 3) !== '切噜～') {
        throw Error('格式不太对');
      }
      const resultText = chieruDecode(sourceText);
      document.getElementById('sourceArea').value = resultText;
    } catch (error) {
      alert(error.message);
    }
  };
};
