import React, { useEffect, useState } from 'react'

//props socket
export default function DisplayCanvas(props) {
  const [drawing, setDrawing] = useState("")
  useEffect(() => {
    props.socket.on("receiveDrawing", (drawing) => {
      // decompressImg(drawing);
      setDrawing(drawing)
    })
    // console.log(drawing)
  }, [props.socket])

  let style = {
    // border:'red 2px solid',
    height: '40vmin',
    // width:'500px',
    fontSize: '400px',
    objectFit: 'contain',
    marginTop: '5vmin',
    width:"100%"
  }
  let styleOfContainer = {
    marginTop: '6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vmin',
    width:"100%"
    // width: '500px'
  }
  // if (drawing !== "") {
  //     style = {

  //         border: '2px black solid',
  //         height: '200px', width: '300px',

  //         background: `url(${drawing}) contain no-repeat fixed center`
  //     }
  // }

  return (
    <div style={styleOfContainer}>
      <img src={`${drawing}`} alt="" style={style} />
    </div>
  )
}

// function decompressImg(data){
//   const dataArray = new Uint8ClampedArray(data.length);
//   let j=0;
//   for(let i=0;i<data.compressedImg.length;i++){    
//     for(let k=0;k<7;k++){
//       dataArray[j++]=(data.img[i]%8)*8;
//       data.img[i]>>=3;
//       dataArray[j++]=(data.img[i]%8)*8;
//       data.img[i]>>=3;
//       dataArray[j++]=(data.img[i]%8)*8;
//       data.img[i]>>=3;
//       dataArray[j++]=255;
//     }
//     if(j===data.length)
//       break;
//   }
//   let blob = new Blob([dataArray], { type: 'image/jpeg' });
//   let reader = new FileReader();
//   reader.onloadend = () => {
//     let base64String = reader.result;
//     setDrawing(base64String)
// };

//   reader.readAsDataURL(blob);
// }