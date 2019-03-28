const generateMessage = (username, text) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}

const generateLocationMessage = (username, url) => {
    return {
        url,
        createdAt: new Date().getTime(),
        username
    }
}

const generateRoomsMessage = (username, rooms, url) => {
    return {
        rooms,
        url,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateRoomsMessage
}