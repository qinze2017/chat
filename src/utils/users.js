const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //Store user
    const user = {
        id,
        username,
        room
    }

    users.push(user)
    return { user }
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}


const getUser = (id) => {

    // const index = users.findIndex((user) => user.id === id)
    // return users[index]

    return users.find((user) => user.id === id)

}


const getUsersInRoom = (room) => {

  room = room.trim().toLowerCase()

  return users.filter((user) => user.room === room)
}

addUser({
    id: 10, 
    username: ' Ze     ',
    room: 'SA'
})

addUser({
    id: 22, 
    username: ' Be     ',
    room: 'SA'
})

addUser({
    id: 31, 
    username: ' Te     ',
    room: 'TA'
})

// console.log(users)

// console.log(getUser(22))

const userList = getUsersInRoom('TO')

//console.log(userList)
// const res = addUser({
//     id: 2, 
//     username: 'ze',
//     room: 'ST'
// })

// console.log(res)

// const removedUser = removeUser(1)

// console.log(removedUser)
// console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}