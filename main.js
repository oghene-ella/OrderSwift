const express = require('express');
const http = require('http');
const app = express();
const OrderingApp = require('./OrderingApp');

const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "html")
app.set("views", "views")

const orderingApp = new OrderingApp();

const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

   orderingApp.joinSession(socket)


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
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/driver', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'driver.html'));
})

app.get('/sender', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sender.html'));
})

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
