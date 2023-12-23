const Driver = require('./Driver');
const Order = require('./Order');
const Sender = require('./Sender');

class OrderingApp {
    constructor() {
        this.orders = [];
        this.drivers = [];
        this.senders = [];
        this.socketUserMap = new Map();
    }

    joinSession(socket) {
        const { name, id, user_type } = socket.handshake.query;
        if (user_type === 'driver') {
            const driver = this.drivers.find(driver => driver.id === id);
            if (driver) {
                this.assignSocket({socket, user: driver});
                return;
            } else {
                this.createUser({ name, socket, user_type});
            }
        } else if (user_type === 'sender') {
            const sender = this.senders.find(sender => sender.id === id);
            if (sender) {
                this.assignSocket({socket, user: sender});
                return;
            } else {
                this.createUser({ name, socket, user_type});
            }
        }
    }

    assignSocket({socket, user}) {
        console.log('Assigning socket to user', user.name);
        this.socketUserMap.set(user.id, socket);
    }

    sendEvent({ socket, data, eventname}) {
        socket.emit(eventname, data);
    }

    createUser({ name, socket, user_type}) {
        switch(user_type) {
            case 'driver':
                const driver = new Driver(name);
                this.drivers.push(driver);
                this.assignSocket({socket, user: driver, user_type});
                this.sendEvent({socket, data: { driver }, eventname: 'driverCreated'})
                console.log('Driver created');
                return driver;
            case 'sender':
                const sender = new Sender(name);
                this.senders.push(sender);
                this.assignSocket({socket, user: sender, user_type});
                this.sendEvent({socket, data: { sender }, eventname: 'senderCreated'})
                console.log('Sender created', this.senders);
                return sender;
            default:
                throw new Error('Invalid user type');
        }
    }


    requestOrder({ current_location, destination, price, id }) {
        console.log('Requesting order');
        const sender = this.senders.find(sender => sender.id === id);
        const order = new Order({ current_location, destination, price, sender });
        this.orders.push(order);

        // notify drivers
        for (const driver of this.drivers) {
            if (driver.in_ride) continue;
            this.sendEvent({socket: this.socketUserMap.get(driver.id), data: { order }, eventname: 'orderRequested'});
        }

        console.log('Order requested', order)
        return order;
    }

    acceptOrder(order) {
        const { id, driver_id } = order;
        // get all info about order
        const driver = this.drivers.find(driver => driver.id === driver_id);
        const _order = this.orders.find(order => order.id === id);
        const sender = this.senders.find(sender => sender.id === _order.sender.id);

        console.log('Accepting order', {_order, driver, sender});

        _order.assignDriver(driver);

        const userSocket = this.socketUserMap.get(sender.id);
        userSocket.emit('orderAccepted', { order: _order });

        const driverSocket = this.socketUserMap.get(driver.id);
        driverSocket.emit('orderAccepted', { order: _order });
    }

    rejectOrder(order) {

        const { id, driver_id } = order;
        const driver = this.drivers.find(driver => driver.id === driver_id);
        const _order = this.orders.find(order => order.id === id);
        const sender = this.senders.find(sender => sender.id === _order.sender.id);

        console.log('Rejecting order', {_order, driver, sender});


        const driverSocket = this.socketUserMap.get(driver.id);
        driverSocket.emit('orderRejected', { order: _order });
    }


}

module.exports = OrderingApp;
