const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

const WIDTH = 1000;
const HEIGHT = 1147;
const path = require('path');

const slipTempPath = decodeURI(encodeURI(path.join(__dirname, 'slip_temp.png')));
async function createReceiptSlip(slipId, name, amtToken, tokenPrice, totalPrice) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const backgroundImg = await loadImage(slipTempPath);
  const qrImg = await loadImage('qr_test.png');

  ctx.drawImage(backgroundImg, 0, 0, WIDTH, HEIGHT);
  const qrWidth = 240;
  const qrHeight = 240;
  ctx.drawImage(qrImg, (WIDTH - 20) - qrWidth, (HEIGHT - 20) - qrHeight, qrWidth, qrHeight)

  ctx.textAlign = 'center';
  ctx.font = '40px Kanit';
  ctx.fillStyle = 'gray';
  ctx.fillText('31/07/2566 - 13:40', WIDTH / 2, 285);

  ctx.textAlign = 'center';
  ctx.font = '40px Kanit';
  ctx.fillStyle = 'black';
  ctx.fillText(name, WIDTH / 2, 420);

  const keyValueY = 550;
  const valueTextX = WIDTH - 215;
  ctx.textAlign = 'right'
  ctx.font = '40px Kanit';
  ctx.fillText(amtToken, valueTextX, keyValueY);
  ctx.fillText(totalPrice, valueTextX, keyValueY + 136);
  ctx.fillText(tokenPrice, valueTextX, keyValueY + 272);

  ctx.fillStyle = 'gray';
  ctx.textAlign = 'left'
  ctx.font = '40px Kanit';
  ctx.fillText(`Slip ID: ${slipId}`, 50, HEIGHT - 50)

  const buffer = canvas.toBuffer('image/png')
  return buffer;
}

module.exports = createReceiptSlip;