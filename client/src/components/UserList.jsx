import React, { useEffect, useState } from 'react'
import "../assets/css/Font.css";
import UserListComponent from "./UserListComponent"
export default function InGame(props) {
  { console.log("i") }
  const [count2, setCount] = useState(1);
  const [usernameAndPonits, setUsernameAndPonits] = useState([])
  document.body.backgroundColor = "#f582eb";
  let color = ['#ebe834', '#1f0ced', '#27B025', '#CB1ECB', '#32AEA6', '#F9B458', '#7FAE7A', '#9D26F4'
    , '#FFA024', '#FD12FE', '#273EC0', '#C966B1', '#7E4A55', '#8E21CF', '#05FCEA', '#D23D0F', '#238DB2', '#C7DF49', '#037C04', '#0A6979'];

  let colorLength = color.length;

  useEffect(() => {
    props.socket.on('userListUpdate', usernameAndPonits => {
      setUsernameAndPonits(usernameAndPonits)
      console.log(setUsernameAndPonits)
    })
  }, [props.socket])
  document.body.style.padding = "2vmin";
  // return (
  //   <>

  //     <div className="leaderboard container text-center" style={{ marginLeft: "0vw", borderRadius: "2vmin" }}>LeaderBoard</div>
  //     {<div className="container border border-warning border-5 px-2 borders2" style={{
  //       width: "100vmin", marginTop: "6vmin", marginLeft: "1vmin",
  //       marginRight: "10vmin", borderRadius: "2vmin", paddingTop: "7vmin", paddingBottom: "4vmin", borderColor: "yellow", display: "block", float: "left"
  //     }}> && {
  //         usernameAndPonits.map(
  //           (user, i) => {
  //             return (
  //               <>
  //                 <UserListComponent key={i} colors={i} user={user} avatar={avatar} color={color} colorLength={colorLength} avatarLength={avatarLength} />
  //               </>)
  //           }
  //         )}</div>}
  //   </>
  // )
  return (
    <>

      <div className="leaderboard container text-center fs-5" style={{ marginLeft: "0vw", borderRadius: "2vmin" }}>LeaderBoard</div>
      {<div className="container border border-warning border-2 px-2 borders2" style={{
        marginTop: "",
        borderRadius: "2vmin", paddingTop: "2vmin", paddingBottom: "4vmin", borderColor: "yellow", height: "50vh", overflowY: "scroll", boxSizing: "border-box"
      }}>  {
          usernameAndPonits.map(
            (user, i) => {
              return (
                <div /*style={{ height: "20%" }}*/>

                  <UserListComponent key={i} colors={i} user={user} avatar={props.socket.avatar} color={color} colorLength={colorLength} />
                </div>)
            }
          )}</div>}
    </>
  )
}