import React, { useEffect, useState } from 'react'
import "../assets/css/Font.css";
import { avatarList } from './JoinRoom';

export default function UserListComponet(props) {
  let colorsCount = 0;


  let badges = [];
  badges.push(['https://4.imimg.com/data4/NC/FH/MY-11054919/gold-medals-500x500.jpg'])
  badges.push(['https://as1.ftcdn.net/v2/jpg/00/65/54/96/1000_F_65549607_59jTsS3ixreo1fJgMDI9J6rlNNIq3g2y.jpg'])
  badges.push(['https://i0.wp.com/www.jumpstreet.co.za/wp-content/uploads/2019/09/IMG_20190902_114710.jpg?fit=300%2C395&ssl=1']);

  // return (
  //   <>
  //     {console.log(props.colors)}

  //     <div className="container col-md-3 borders" style={{ width: "80vmin" }}>
  //       {props.colors == 0 && <img className="imageCharacter" src={`${badges[0]}`} alt="Card image cap" style={{ width: "7vmin" }} />}
  //       {props.colors == 1 && <img className="imageCharacter" src={`${badges[1]}`} alt="Card image cap" style={{ width: "7vmin" }} />}  {props.colors == 2 && <img className="imageCharacter" src={`${badges[2]}`} alt="Card image cap" style={{ width: "7vmin" }} />}
  //       {props.colors > 2 && <div style={{ display: "inline-block", fontSize: "5vmin", color: "white",marginLeft:"2vmin",marginRight:"2.8vmin" }}>{`${props.colors + 1}`}</div>}
  //       <div className='container col-md-2 my-2 borders py-1 myfont' style={{ color: " blue", width: "55vmin", height: "7vmin", backgroundColor: `${props.color[(props.colors) % props.colorLength]}`, display: "inline-block", fontWeight: "bold", borderColor: "green" }}><div className="Point" style={{ display: "inline-block", fontSize: "2vmin" }}>{`${props.user.points}`}</div>
  //         <div className="Name" style={{ display: "inline-block", fontSize: "3vmin" }}>{`${props.user.username}`}</div>
  //       </div>
  //       <img className="imageCharacter" src={`${props.avatar[(props.colors) % props.avatarLength]}`} alt="Card image cap" style={{ width: "8vmin" }} />
  //       {/* <img className="imageCharacter" src={images2} alt="Card image cap" style={{ width: "8vmin" }} /> */}

  //     </div>

  //   </>
  // )


  return (
    <>
      {console.log(props.colors)}

      <div className="container-md  borders" style={{ padding: "0", marginTop: "5px" }}>
        <div className="col-1 col-sm-1" style={{ display: "inline-block" /*transform: "scale(65%)", marginTop: "-12px"*/ }}>
          {props.colors == 0 && <img className="imageCharacter" style={{ width: "100%" }} src={`${badges[0]}`} alt="Card image cap" />}
          {props.colors == 1 && <img className="imageCharacter" style={{ width: "100%" }} src={`${badges[1]}`} alt="Card image cap" />}
          {props.colors == 2 && <img className="imageCharacter" style={{ width: "100%", filter: "hue-rotate(-30deg)" }} src={`${badges[0]}`} alt="Card image cap" />}
          {props.colors > 2 && <div style={{ display: "inline-block", fontSize: "5vmin", color: "white", /*marginLeft: "2vw", marginRight: "2.8vw"*/ marginBottom: "20px" }}>{`${props.colors + 1}`}</div>}


        </div>


        <div className="container col-9 col-sm-9 borders py-1 myfont" style={{ color: " blue" /*width: "300px"*/, height: "100%", backgroundColor: `${props.color[(props.colors) % props.colorLength]}`, display: "inline-block", fontWeight: "bold", borderColor: "green" }}>
          <div className="Point fs-6" style={{ display: "inline-block", /*fontSize: "2.5vh"*/ }}> {`${props.user.points}`} </div>
          <div className="Name fs-6" style={{ display: "inline-block", fontSize: "2vh" }}> {`${props.user.username}`} </div>
        </div>
        <img className="imageCharacter col-2 col-sm-2 col-lg-1" src={avatarList[props.user.avatar]} alt="Card image cap" style={{ objectFit: "contain", height: "100%" }} />

      </div>

    </>
  )

}