import React, { useEffect, useRef, useState } from 'react'
import EditBox from "./EditBox"
import RgbQuant from "rgbquant"

let prevDrawing = "";
//props socket
export default function CanvasBox(props) {


  //Drawing related
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false)
  const [width, setWidth] = useState(Window.innerWidth)
  // const [height, setHeight] = useState(Window.innerHight)


  //socket.io related
  setInterval(async () => {
    if (canvasRef.current !== null) {
      if (prevDrawing !== canvasRef.current.toDataURL()) {
        // let compressImg = compressDrawing(ctx.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data);
        // console.log("_+", canvasRef.current.toDataURL("image/webp").length, canvasRef.current.toDataURL("image/webp"))
        // console.log("_+", canvasRef.current.toDataURL("image/webp", 0.5).length, canvasRef.current.toDataURL("image/webp", 0.5))

        await props.socket.emit("sendDrawing", canvasRef.current.toDataURL("image/webp"))
        // await props.socket.emit("sendDrawing",compressImg)
        prevDrawing = canvasRef.current.toDataURL()
      }
    }
  }, 2000);


  //Drawing properties
  const [color, setColor] = useState("#000000")
  const [thickness, setThickness] = useState(1)


  useEffect(() => {

    const canvas = canvasRef.current;
    //setting  internal size of canvas

    // canvas.width = 427;
    // canvas.height = 240;
    ctx.current = canvas.getContext("2d")
    // ctx.current.scale(.001, .001)
    if (window.matchMedia("(max-width: 650px)").matches) {
      canvas.style.height = `${window.innerHeight * .80}px`;
      canvas.style.width = `${window.innerWidth * .9}px`;

      canvas.height = window.innerHeight * .40;
      canvas.width = window.innerWidth * .45;
      console.log("size=", canvas.height * canvas.width)

    }
    // if (window.innerWidth <= 1280 * 1.1) {
    //   canvas.style.width = `${window.innerWidth * .90}px`;
    //   canvas.style.height = `${window.innerWidth * .90 * 0.5625}px`;
    // ctx.current.scale(canvas.width / Number(canvas.style.width.replace(/px$/, '')), canvas.height / Number(canvas.style.height.replace(/px$/, '')))
    // }
    else {
      canvas.style.width = `914px`;
      canvas.style.height = `514px`;
      // ctx.current.scale(1.1, 1.1)
      canvas.width = 427;
      canvas.height = 240;
    }


    //initial drawing atributes set
    ctx.current.lineCap = "round"
  }, [window.innerWidth])

  //setting so that changing window size adjust drawing
  // useEffect(() => {

  //   const canvas = canvasRef.current;
  //   if (window.matchMedia("(max-width: 650px)").matches) {
  //     canvas.style.height = `${window.innerHeight * .90}px`;
  //     canvas.style.width = `${canvas.style.height * 1.78}px`;

  //   }
  // if (window.innerWidth <= 1280 * 1.1) {
  //   canvas.style.width = `${window.innerWidth * .90}px`;
  //   canvas.style.height = `${window.innerWidth * .90 * 0.5625}px`;
  // ctx.current.scale(canvas.width / Number(canvas.style.width.replace(/px$/, '')), canvas.height / Number(canvas.style.height.replace(/px$/, '')))
  // }
  //   else {
  //     canvas.style.width = `640px`;
  //     canvas.style.height = `360px`;
  //     // ctx.current.scale(1.1, 1.1)
  //   }
  //   setWidth(window.innerWidth)
  // }, [window.innerWidth])

  //functions--
  function startDrawing(event) {
    if (event.button !== 0) return;
    setIsDrawing(true)
    ctx.current.beginPath()
    ctx.current.moveTo(...getCoordinates(event))
    ctx.current.strokeStyle = color
    ctx.current.lineWidth = thickness

  }
  function finishDrawing() {
    if (!isDrawing) return;
    ctx.current.closePath();
    setIsDrawing(false)
  }
  function drawing(event) {
    if (!isDrawing) return;
    ctx.current.lineTo(...getCoordinates(event));
    ctx.current.stroke()
  }
  function getCoordinates(event) {
    return [canvasRef.current.width / canvasRef.current.getBoundingClientRect().width * event.nativeEvent.offsetX, canvasRef.current.height / Number(canvasRef.current.style.height.replace(/px$/, '')) * event.nativeEvent.offsetY]

  }
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-3 col-m-2 col-lg-4'>
          <EditBox className="col-lg-2" color={color} setColor={setColor} thickness={thickness} setThickness={setThickness} />
        </div>
        <span className="col fs-4" style={{ color: "white" }}>🖌 {props.winningWord}  🖌</span>
      </div>
      <div className='row'>
        <canvas ref={canvasRef} onPointerLeave={finishDrawing} onPointerDown={startDrawing} onPointerUp={finishDrawing} onPointerMove={drawing} style={{
          touchAction: "none", padding: 0, border: 'solid white 2px', margin: 'auto', backgroundColor: "white"
        }} ></canvas>
        <div height="2px"></div>
      </div>
    </div>
  )
}
function compressDrawing(imageData) {
  // console.log(imageData)
  let n = 0;

  var array = new Uint8Array(imageData.length / 4);
  for (let i = 0; i < imageData.length; i += 4) {
    if (imageData[i + 4] === 0)
      array[i / 4] = 255;
    else
      array[i / 4] = Math.floor((imageData[i] / 8)) * 32 + Math.floor((imageData[i] / 8)) * 4 + Math.floor(imageData[i] / 16);
  }
  let b64encoded = btoa(String.fromCharCode.apply(null, array));
  console.log(b64encoded.length, "***", array.length / 8)
  // console.log(b64encoded)
  // console.log(JSON.stringify(array).length);
  // console.log(JSON.stringify(q.reduce(imageData)).length)
}