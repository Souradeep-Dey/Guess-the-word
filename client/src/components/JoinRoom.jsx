import React from 'react'
import { useState, useEffect } from 'react';
import photo from './guess-the-word.jpg';
import '../assets/css/Font.css'
import photo2 from './guess.jpeg';

import { Link } from "react-router-dom"

import Avatar0 from "../assets/avatar/Avatar1.png"
import Avatar1 from "../assets/avatar/Avatar2.png"
import Avatar2 from "../assets/avatar/Avatar3.png"
import Avatar3 from "../assets/avatar/Avatar4.png"
import Avatar4 from "../assets/avatar/Avatar5.png"
let numberOfAvatar = 5;
export const avatarList = [Avatar0, Avatar1, Avatar2, Avatar3, Avatar4];
export default function JoinRoom() {
  const [username, setUsername] = useState("")
  const [roomId, setRoomId] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const canJoinRoom = () => {
    if (username !== "" && roomId !== "") {
      if (selectedAvatar < 0)
        setSelectedAvatar(numberOfAvatar + selectedAvatar);
      return true;
    }
    return false;
  }
  document.body.style.backgroundColor = "#160238";

  // return (
  //   <>

  //     <div className="card container px-0 my-5 gy-5" style={{ width: "80vmin", display: "block"}}>
  //       <img className="card-img-top" src={photo2} alt="Card image cap" />
  //       <div className="card-body">
  //         <div className="card-title text-center text-center cardHead"><strong>Enter The Details</strong></div>
  //         <input type="text" className="border-2 rounded myfont px-2" placeholder="username" onChange={e => setUsername(e.target.value)} style={{ display: "block", width: "100%", height: "8vmin", fontSize: "3vmin", fontWeight: "bold" }} />
  //         <input type="text" className="my-3 border-2 rounded myfont px-2" placeholder="Room id" onChange={e => setRoomId(e.target.value)} style={{ display: "block", width: "100%", height: "8vmin", fontSize: "3vmin", fontWeight: "bold" }} />
  //         <Link className="btn btn-danger text-center joinButton" to={canJoinRoom() ? `/InGame/username=${username}_roomid=${roomId}` : "#"} state={{ username, roomId }} style={{ display: "block", height: "8vmin", fontSize: "3vmin", paddingTop: "-1vmin" }}><strong>Join</strong></Link>
  //       </div>
  //     </div>
  //   </>

  // )

  //Souradeep
  return (
    <>

      <div className="card container px-0 my-5 gy-5" style={{ width: "80vmin", display: "block" }}>
        <img className="card-img-top" src={photo2} alt="Card image cap" />
        <div className="card-body">

          <div className="card-title text-center text-center cardHead "><strong>Choose Avatar</strong></div>

          <div id="carouselExample" className="carousel carousel-dark slid ">
            <div className="carousel-inner">
              <div className="carousel-item active" >
                <img src={Avatar0} className="d-block w-50" alt="..." style={{ transform: "translatex(50%)" }} />
              </div>
              <div className="carousel-item" >
                <img src={Avatar1} className="d-block w-50" alt="..." style={{ transform: "translatex(50%)" }} />
              </div>
              {/* <avatarRenderer props={avatarList}/>; */}

              <div className="carousel-item" >
                <img src={Avatar2} className="d-block w-50" alt="..." style={{ transform: "translatex(50%)" }} />
              </div>
              <div className="carousel-item" >
                <img src={Avatar3} className="d-block w-50" alt="..." style={{ transform: "translatex(50%)" }} />
              </div>
              <div className="carousel-item" >
                <img src={Avatar4} className="d-block w-50" alt="..." style={{ transform: "translatex(50%)" }} />
              </div>
            </div>
            <button className="carousel-control-prev btn-primary" type="button" data-bs-target="#carouselExample" data-bs-slide="prev" onClick={() => { setSelectedAvatar((selectedAvatar - 1) % numberOfAvatar) }}>
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next btn-primary" type="button" data-bs-target="#carouselExample" data-bs-slide="next" onClick={() => { setSelectedAvatar((selectedAvatar + 1) % numberOfAvatar) }}>
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>


          <div className="card-title text-center text-center cardHead"><strong>Enter The Details</strong></div>
          <input type="text" className="border-2 rounded myfont px-2" placeholder="username" onChange={e => setUsername(e.target.value)} style={{ display: "block", width: "100%", height: "8vmin", fontSize: "5vmin", fontWeight: "bold" }} />
          <input type="text" className="my-3 border-2 rounded myfont px-2" placeholder="Room id" onChange={e => setRoomId(e.target.value)} style={{ display: "block", width: "100%", height: "9vmin", fontSize: "5vmin", fontWeight: "bold" }} />
          <Link className="btn btn-danger text-center joinButton" to={canJoinRoom() ? `/InGame/username=${username}_roomid=${roomId}` : "#"} state={{ username, roomId, selectedAvatar }} style={{ display: "block", height: "10vmin", fontSize: "4vmin", textAlign: "centre", justifyContent: "center", paddingTop: "-4vmin" }}><strong style={{ display: "block" }}>Join</strong></Link>
        </div>
      </div>
    </>

  )

}

//   function avatarRenderer(avatarList){
//   return (
//     props.avatarList.map((avatar,i)=>{
//       return (
//       <div className="carousel-item" >
//                 <img src={avatar} className="d-block w-50" alt="..." style={{transform: "translatex(50%)"}}/>
//               </div>
//         )
//     })


//       )
// }