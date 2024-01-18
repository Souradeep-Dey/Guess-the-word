const { log } = require("console");
const sendUserDetails = require('./sendUserDetails').sendUserDetails
const imageCreator = require('./imageCreator').imageCreator
let words = require('./Words');

async function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000))
}

function randomWordGenerator() {
  let randomWord1 = words[Math.floor(Math.random() * words.length)];
  let randomWord2 = words[Math.floor(Math.random() * words.length)];
  let randomWord3 = words[Math.floor(Math.random() * words.length)];
  while (randomWord1 === randomWord2 || randomWord2 === randomWord3) {
    randomWord1 = words[Math.floor(Math.random() * words.length)];
    randomWord2 = words[Math.floor(Math.random() * words.length)];
    randomWord3 = words[Math.floor(Math.random() * words.length)];
  }

  return [randomWord1, randomWord2, randomWord3]
}

async function turnSwitching(roomId, userList, io, currentRoomDetails) {
  const socket = userList[currentRoomDetails.whoseTurn]
  let disconnectChecker;
  let wordChosenOrNotChecker;
  let everyOneGuessedChecker;
  let timeout;
  await io.sockets.in(socket.id).emit('turnSwitch', { username: socket.userName, words: randomWordGenerator() })

  await new Promise(async (resolve) => {
    await socket.to(roomId).emit('receiveDrawing', imageCreator(`${socket.userName}'s turn`))
    timeout = setTimeout(async () => {
      await io.sockets.in(socket.id).emit('wordChoosingTimeout')
      await io.sockets.in(roomId).emit('receiveDrawing', imageCreator(`${socket.userName} Missed`));
      await sleep(3)
      resolve(false)
    }, 15000)
    wordChosenOrNotChecker = setInterval(async () => {
      //word chosen
      if (currentRoomDetails.wordChosen && currentRoomDetails.winningWord !== "") {
        resolve(true);
        clearInterval(wordChosenOrNotChecker);
      }
      //word skipped
      else if (currentRoomDetails.wordChosen) {
        clearInterval(wordChosenOrNotChecker);
        clearTimeout(timeout);
        await sendUserDetails(io, userList, roomId);
        await sleep(0.2);

        await io.sockets.in(roomId).emit('receiveDrawing', imageCreator(`${socket.userName} skipped`));
        await sleep(3)
        resolve(false);

      }
    }, 500
    )
    disconnectChecker = setInterval(async () => {
      if (!userList.includes(socket)) {
        clearInterval(disconnectChecker);
        clearTimeout(timeout);
        currentRoomDetails.whoseTurn -= 1
        await socket.to(roomId).emit('receiveDrawing', imageCreator(`${socket.userName} disconnected`));
        await sleep(3)
        resolve(false);
      }
    }, 1000
    )
  }).then(async (hasChosenWord) => {
    clearTimeout(timeout)
    clearInterval(wordChosenOrNotChecker)
    clearInterval(disconnectChecker)
    return new Promise(async (resolve) => {
      if (!hasChosenWord)
        return resolve(false)

      let timeout = setTimeout(async () => {
        await io.sockets.in(socket.id).emit('drawingTimeout')
        resolve(true)
      }, 60000)

      everyOneGuessedChecker = setInterval(async () => {
        if (currentRoomDetails.hasEveryOneGuessed || currentRoomDetails.noOfPlayersGuessed === userList.length - 1) {
          currentRoomDetails.hasEveryOneGuessed = false;
          clearTimeout(timeout);
          clearInterval(everyOneGuessedChecker);
          await sleep(1)
          await io.sockets.in(roomId).emit("everyoneGuessedCorrect")
          await io.sockets.in(roomId).emit('receiveDrawing', imageCreator(`Everyone got correct`));
          await sleep(3)
          resolve(true);
        }
      }, 500
      )

      disconnectChecker = setInterval(async () => {
        if (!userList.includes(socket)) {
          resolve(false);
          clearInterval(disconnectChecker);
          clearTimeout(timeout);
          currentRoomDetails.whoseTurn -= 1
          await socket.to(roomId).emit('receiveDrawing', imageCreator(`${socket.userName} disconnected`));
          await sleep(3)
          resolve(false);
        }
      }, 1000
      )
      //await socket.to(roomId).emit("startGuessing", currentRoomDetails.winningWord)
    }).then(async () => {
      //making values default
      currentRoomDetails.noOfPlayersGuessed = 0;
      currentRoomDetails.winningWord = ""
      currentRoomDetails.wordChosen = false
      currentRoomDetails.hasEveryOneGuessed = false;
      userList.forEach(sock => sock.hasGuessed = false)
      clearInterval(everyOneGuessedChecker);
      clearInterval(disconnectChecker);
      if (userList.length === 1) {
        await io.sockets.in(roomId).emit('receiveDrawing', imageCreator(`You Are Alone`))
        return
      }
      await io.sockets.in(roomId).emit('receiveDrawing', imageCreator(`Interval`))
      // console.log("Hello")
      await sleep(3)
    })
  })

  return new Promise(resolve => resolve())

}

exports.turnSwitching = turnSwitching;
exports.randomWordGenerator = randomWordGenerator;
