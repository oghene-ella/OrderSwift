// Import all the libraries and modules into the project
const express = require('express');
const http = require('http');
const app = express();
const OrderingApp = require('./OrderingApp');
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "html")
app.set("views", "views")

// make an instance of the OrderingApp, server using the express server
const orderingApp = new OrderingApp();
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// socket connection for all the requests
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("join", (user_type, Username )=>{
        const userInfo = {
            socket:socket,
            user_type:user_type,
            name:Username
        }

        orderingApp.joinSession(userInfo)
    })

   socket.on('requestOrder', (order) => {
        console.log('Requesting order', order);
        orderingApp.requestOrder(order);
    });

    socket.on('acceptOrder', (order) => {
        orderingApp.acceptOrder(order);
    });

    socket.on('rejectOrder', (order) => {
        orderingApp.rejectOrder(order);
    });

    socket.on("finishRide", (id, driverId)=>{
        orderingApp.finishRide(id, driverId)
    })
});

// get methods for all the routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/driver', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'driver.html'));
})

app.get('/sender', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sender.html'));
})


// server listen connection
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
