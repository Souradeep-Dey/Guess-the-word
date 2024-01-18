const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(640, 360)
const ctx = canvas.getContext('2d')
ctx.font = '50px Impact'
const x = canvas.width / 2;
const y = canvas.height / 2;
ctx.textAlign = 'center';

function imageCreator(string){
  ctx.clearRect(0,0,640,360)
  ctx.fillText(string, x,y)
  return canvas.toDataURL()
}
exports.imageCreator = imageCreator;