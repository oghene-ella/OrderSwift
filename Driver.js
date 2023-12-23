class Driver {
    constructor(name) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.name = name;
        this.in_ride = false;
    }
    
    acceptOrder(order) {
        console.log(`${this.name} accepts order ${order.id}`);
        order.assignDriver(this);
    }

    rejectOrder(order) {
        console.log(`${this.name} rejects order ${order.id}`);
    }
}

module.exports = Driver;