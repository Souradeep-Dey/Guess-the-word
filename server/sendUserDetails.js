function sendUserDetails(io,userList,roomId){
  let usernameAndPonits=userList.map(item=>{
        return {username:item.userName,points:item.points,avatar:item.avatar}
        }).sort((a,b)=>{return b.points-a.points})
  
    return io.sockets.in(roomId).emit('userListUpdate',usernameAndPonits)
}
exports.sendUserDetails = sendUserDetails;