const express = require('express');
const app = express()
const http = require("http");
const cors = require("cors");
const imageCreator = require('./imageCreator').imageCreator
const { Server } = require("socket.io");
const allFunction = require('./parentFunction');
const turnSwitching = allFunction.turnSwitching;
const sendUserDetails = require('./sendUserDetails').sendUserDetails
// const randomWordGenerator = allFunction.randomWordGenerator;

let userList = new Map();
let roomDetails = new Map();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"

  }
})
server.listen(3001, () => {
  console.log("Server Running");
})

// io.set('heartbeat timeout', 10) io.set('heartbeat interval', 4)
io.on("connection", (socket) => {
  console.log(socket.id, "Connected");
  // setInterval(async()=>{
  //   await io.emit("ping")
  // },2000)

  socket.on("joinRoom", async (roomId, userName, avatar) => {

    console.log(`User joined room ${roomId}`)
    //removing the socket from other rooms
    // console.log(socket.rooms)
    socket.rooms.forEach(room => {
      if (room !== roomId && room !== socket.id) {
        socket.leave(room)
        onLeaveManager(socket, room)
      }
    })



    if (userList.has(roomId)) {
      if (!userList.get(roomId).includes(socket)) {
        userList.get(roomId).push(socket);
        socket.join(roomId);
        socket.roomId = roomId
        socket.userName = userName
        socket.points = 0
        socket.hasGuessed = false
        socket.avatar = avatar
      }
    }
    else {
      socket.join(roomId);
      socket.roomId = roomId
      socket.userName = userName
      socket.points = 0
      socket.hasGuessed = false
      socket.avatar = avatar
      userList.set(roomId, [socket]);
      //the false shows game has not started
      roomDetails.set(roomId, {
        winningWord: "",
        whoseTurn: 0,
        gameRunning: false,
        noOfPlayersGuessed: 0,
        wordChosen: false,
        hasEveryOneGuessed: false,
        someonesTurnOngoing: false,
        currentDrawing: ""
      })
      await io.sockets.in(socket.id).emit('receiveDrawing', imageCreator(`You Are Alone`))
    }
    if (roomDetails.get(socket.roomId).someonesTurnOngoing && !roomDetails.get(socket.roomId).wordChosen)
      await io.sockets.in(socket.id).emit('receiveDrawing', imageCreator(`${userList.get(socket.roomId)[roomDetails.get(socket.roomId).whoseTurn].userName}'s turn`))

    else if (roomDetails.get(socket.roomId).someonesTurnOngoing && roomDetails.get(socket.roomId).wordChosen && !roomDetails.get(socket.roomId).hasEveryOneGuessed) {
      await io.sockets.in(socket.id).emit('startGuessing', roomDetails.get(socket.roomId).winningWord);
      await io.sockets.in(socket.id).emit('receiveDrawing', roomDetails.get(socket.roomId).currentDrawing)
    }

    //send userlist
    await sendUserDetails(io, userList.get(roomId), roomId)

    if (!roomDetails.get(socket.roomId).gameRunning && userList.get(roomId).length > 1) {
      roomDetails.get(socket.roomId).gameRunning = true;
      startGame(roomId)
    }

  })
  socket.on("sendMessage", async (messageData) => {
    console.log(messageData.message)
    let currentRoomDetails = roomDetails.get(socket.roomId)
    let currentUserList = userList.get(socket.roomId)
    if (messageData.hasGuessed) {
      socket.hasGuessed = true
      currentRoomDetails.noOfPlayersGuessed += 1
      //adding points to players
      if (currentRoomDetails.noOfPlayersGuessed === 1)
        socket.points += 80
      else if (currentRoomDetails.noOfPlayersGuessed === 2)
        socket.points += 60
      else if (currentRoomDetails.noOfPlayersGuessed === 3)
        socket.points += 50
      else
        socket.points += 40

      //adding points to drawer too
      currentUserList[currentRoomDetails.whoseTurn].points += Math.round(100 / (currentUserList.length - 1))
      if (currentRoomDetails.noOfPlayersGuessed === currentUserList.length - 1) {
        currentRoomDetails.hasEveryOneGuessed = true;
      }
      //sending userdetails
      await sendUserDetails(io, currentUserList, socket.roomId)
    }
    await socket.to(socket.roomId).emit("receiveMessage", messageData)
  })

  socket.on('wordChosen', async (word) => {
    let currentRoomDetails = roomDetails.get(socket.roomId)
    if (word === "skip")
      currentRoomDetails.wordChosen = true
    else {
      currentRoomDetails.wordChosen = true
      currentRoomDetails.winningWord = word;
      await socket.to(socket.roomId).emit('startGuessing', word)
    }
  })

  socket.on('sendDrawing', async drawing => {
    if (userList.get(socket.roomId)[roomDetails.get(socket.roomId).whoseTurn] === socket && !roomDetails.get(socket.roomId).hasEveryOneGuessed) {
      roomDetails.get(socket.roomId).currentDrawing = drawing
      await socket.to(socket.roomId).emit('receiveDrawing', drawing)
    }
  })


  socket.once("disconnect", async () => {

    if (!socket.roomId)
      return
    console.log("user disconnect", socket.userName)
    onLeaveManager(socket, socket.roomId)
  })
})




//this function keeps the game running
async function startGame(roomId) {
  if (!roomDetails.get(roomId).gameRunning || roomDetails.get(roomId).someonesTurnOngoing)
    return

  roomDetails.get(roomId).someonesTurnOngoing = true;
  await turnSwitching(roomId, userList.get(roomId), io, roomDetails.get(roomId))
  roomDetails.get(roomId).someonesTurnOngoing = false;
  roomDetails.get(roomId).whoseTurn = (roomDetails.get(roomId).whoseTurn + 1) % (userList.get(roomId).length)
  console.log(roomDetails.get(roomId).whoseTurn)

  //sending userList before next round
  await sendUserDetails(io, userList.get(roomId), roomId)

  startGame(roomId)
}

async function onLeaveManager(socket, roomId) {
  let userDetails = userList.get(roomId);//room details of the user that needs deletion
  userDetails.splice(userDetails.findIndex((i) => {
    return i === socket;
  }), 1);

  //checking if the user has guessed
  if (socket.hasGuessed && roomDetails.get(roomId).noOfPlayersGuessed > 0)
    roomDetails.get(roomId).noOfPlayersGuessed -= 1
  //checking no user is the room
  if (userDetails.length === 0) {
    roomDetails.delete(roomId);
    userList.delete(roomId);
    return;
  }
  //checking if only 1 user is in game
  if (userDetails.length === 1) {
    roomDetails.get(roomId).gameRunning = false
    await io.sockets.in(roomId).emit('receiveDrawing', imageCreator(`You Are Alone`))
  }

  userList.set(roomId, userDetails);
  console.log(socket.userName, "Left room", roomId)
  await sendUserDetails(io, userList.get(roomId), roomId)
}