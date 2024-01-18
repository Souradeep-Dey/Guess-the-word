import React, { useEffect, useState } from 'react'
import "../assets/css/Chat.css"
// import ScrollToBottom from 'react-scroll-to-bottom'
//props:socket,usename,roomId
export default function Chat(props) {

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([])
  // const [props.props.props.props.props.winningWord, setWinningWord] = useState("");
  // const winningWord=props.winningWord;
  // const setWinningWord=props.setWinningWord;
  const [hasGuessed, setHasGuessed] = useState(false)

  useEffect(() => {
    props.socket.on("receiveMessage", (message) => {
      setMessageList((list) => [...list, message])
    })

    props.socket.on('startGuessing', word => {
      props.setWinningWord(word);
      setHasGuessed(false)
      setMessage("")
      console.log(typeof (word))
      console.log(props.winningWord)
    })


  }, [props.socket])

  async function sendMessage() {
    if (message !== "" && message !== "Please Wait...") {
      console.log(props.winningWord === message, props.winningWord, message)
      let messageData;
      if (message.toLowerCase().replace(/\s/g, '') === props.winningWord.toLowerCase().replace(/\s/g, '')) {
        setHasGuessed(true)
        messageData = {
          room: props.roomId,
          author: props.username,
          message: `${props.socket.username} got correct answer`,
          // time: new Date(Date.now()).getHours() + ":"
          //   + new Date(Date.now()).getMinutes(),
          hasGuessed: true,
          senderId: props.socket.id
        }
        setMessage("Please Wait...")
      }
      else {
        messageData = {
          room: props.roomId,
          author: props.username,
          message,
          // time: new Date(Date.now()).getHours() + ":"
          //   + new Date(Date.now()).getMinutes(),
          hasGuessed: false,
          senderId: props.socket.id
        }
        setMessage("")
      }
      await props.socket.emit("sendMessage", messageData)
      setMessageList((list) => [...list, messageData])

    }
  }


  return (
    <>
      <div className='chat-window' style={{ /*width: "40vmin",*/ paddingTop: "-3vmin" }}>
{ 
        <div className='chat-header' style={{ paddingTop: "0vmin", height: "2.2rem" }}>
          <p className="text-center" style={{ textAlign:"center",margin:"auto"}}>Live chat</p>
        </div> }
        <div className='chat-body'>
          <div className="message-container">
            {messageList.map((messageContent, i) => {
              return (<div key={i} className='message' id={props.socket.id === messageContent.senderId ? "you" : messageContent.author}>

                <div className='message-content'> <p>{messageContent.message}</p></div>
                <div className='message-meta'>
                  {/* <p id="time">{messageContent.time}</p> */}
                  <p id="author">{props.username === messageContent.author ? "you" : messageContent.author}</p>
                </div>

              </div>
              )


            })}
          </div>
        </div>

        <div className='chat-footer'>
          <input type="text" placeholder='Guess...' onChange={e => !hasGuessed && setMessage(e.target.value)} value={message} onKeyPress={e => { e.key === 'Enter' && sendMessage() }} />
          <button onClick={sendMessage} >&#9658;</button>
        </div>
      </div>

    </>
  )
}
