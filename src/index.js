const express = require('express')
const path = require('path')
const http = require('http')
const url = require('url')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage, generateRoomsMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, findallExisteRooms } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {

    console.log('New WebSocket connection')

    socket.on('join', ( options, callback) => {
        const {error, user} = addUser({id:socket.id, ...options})

        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('send', generateMessage('Admin','Welcome!'))
        //send anothers except himself
        //socket.broadcast.emit('send', generateMessage('A new user has joined!'))
        socket.broadcast.to(user.room).emit('send', generateMessage('Admin',`${user.username} has joined!`))
       
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (message, callback) => {

        const user = getUser(socket.id)

        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        //io.emit('send', generateMessage(message))
        io.to(user.room).emit('send', generateMessage(user.username, message))
        callback('Delivered!')
    })

    socket.on('sendRooms', () => {
        const user = getUser(socket.id)
        //console.log(socket.handshake.headers.host)
        io.to(user.room).emit('RoomsMessage', generateRoomsMessage(user.username, user.room, findallExisteRooms(user.room), `http://${socket.handshake.headers.host}/chat.html?username=admin&room=` ))
    })

    socket.on('sendLocation', (coords, callback) => {

        const user = getUser(socket.id)

        //io.emit('send', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        io.to(user.room).emit('LocationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('send', generateMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

        
    })
})

server.listen( port, () => {
    console.log('Server port : ' + port)
})