class Order {
    constructor({ current_location, destination, price, sender }) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.current_location = current_location;
        this.destination = destination;
        this.status = 'pending';
        this.price = price;
        this.sender = sender;
        this.driver = null;
    }
}

module.exports = Order;