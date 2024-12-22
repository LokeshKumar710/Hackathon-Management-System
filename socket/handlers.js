const users = new Set();

function handleConnection(socket, io) {
    // Add the connected user
    users.add(socket.id);

    // Notify all clients about the updated user list and active user count
    io.emit("activeUsers", users.size);

    console.log(`User connected: ${socket.id}. Active users: ${users.size}`);

    // Handle drawing data broadcast
    socket.on("draw", (data) => {
        // Broadcast drawing data to all other clients
        socket.broadcast.emit("draw", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        // Remove user from the set
        users.delete(socket.id);
        console.log(`User disconnected: ${socket.id}. Active users: ${users.size}`);

        // Notify all clients about the updated active user count
        io.emit("activeUsers", users.size);
    });
}

module.exports = { handleConnection };