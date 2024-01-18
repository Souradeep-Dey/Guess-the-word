import React, { useState, useEffect } from 'react'
import CanvasBox from './CanvasBox'
import io from 'socket.io-client';
import Chat from './Chat';
import DisplayCanvas from './DisplayCanvas';
import UserList from './UserList';
import "../assets/css/Font.css"
import "../assets/css/App.css"
import { useLocation, Navigate } from "react-router-dom"


const socket = io.connect("http://localhost:3001/")
let drawingTimeOut;
let wordChoosingTimeout;
export default function InGame() {
  document.body.style.background = "url('https://img.freepik.com/free-vector/futuristic-technological-wallpaper_79603-1092.jpg')";
  document.body.style.backgroundBlendMode = "lighten";
  document.body.style.backgroundSize = "cover";
  if (!useLocation().state)
    return <Navigate to="/" />

  const { username, roomId, selectedAvatar } = useLocation().state;
  // console.log(selectedAvatar);
  const [myTurn, setMyTurn] = useState(false)
  const [words, setWords] = useState([])//This words has the 3 words
  const [hasChosenWord, setHasChosenWord] = useState(false)
  const [winningWord, setWinningWord] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", roomId, username, selectedAvatar)
    socket.username = username;
    socket.roomId = roomId
  }, [])

  useEffect(() => {
    socket.on("turnSwitch", ({ username, words }) => {
      document.body.backgroundColor = ""
      //if (socket.username === username)
      setMyTurn(true)
      setWords([...words, "skip"])
    })
    socket.on("everyoneGuessedCorrect", () => {

      setHasChosenWord(false)
      if (drawingTimeOut)
        clearTimeout(drawingTimeOut)

    })
    socket.on('wordChoosingTimeout', () => {

      setMyTurn(false);
      if (wordChoosingTimeout)
        clearTimeout(wordChoosingTimeout)

    })
    socket.on("drawingTimeout", () => {

      setHasChosenWord(false)
      if (drawingTimeOut)
        clearTimeout(drawingTimeOut)

    })
  }, [socket])

  //my turn of choosing word
  if (myTurn) {
    wordChoosingTimeout = setTimeout(() => {
      setMyTurn(false);
      //socket.emit('wordChosen', "skip");
    }, 14500)
    console.log(myTurn, socket.username, username)
    return (

      <div className="h-100 ">
        <div className="position-absolute top-50 start-50">
          {words.map((word, i) => {
            return (<button className="btn btn-light m-1 " onClick={() => {
              socket.emit('wordChosen', words[i]);
              setMyTurn(false);
              i != 3 && setHasChosenWord(true);
              i != 3 && setWinningWord(words[i]);
              clearTimeout(wordChoosingTimeout)
            }}
              key={i}>
              {word}</button>)
          })}
        </div>
      </div>
    )
  }
  //my turn of drawing
  else if (hasChosenWord) {
    drawingTimeOut = setTimeout(() => { setHasChosenWord(false) }, 59500)
    return (<CanvasBox socket={socket} winningWord={winningWord} />)
  }
  //others turn
  else
    return (
      <>
        {/* <div className="row"> */}
        <div>

          <div className="col-12 col-sm-6 col-lg-4" style={{ border: '2px black solid', background: "white", color: "white", height: "60vmin", display: "inline-block" }}>
            <DisplayCanvas socket={socket} />
          </div>
          <div className='col-7 col-sm-5 col-lg-4' style={{ marginLeft: "0vw", display: "inline-block", height: "60vmin", transform: "translateY(2%)" }}>
            <UserList socket={socket} />
          </div>
          {/* </div> */}
          <div className="col-5 col-sm-6 col-lg-4" style={{ paddingTop: "-12vmin", display: "inline-block", position: "absolute" }}>
            <Chat socket={socket} username={username} roomId={roomId} winningWord={winningWord} setWinningWord={setWinningWord} />
          </div>
        </div>
      </>


    );

}
