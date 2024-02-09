class Sender {
    constructor(name) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.name = name;
    }

    requestOrder(order) {
        console.log(this.name, 'is requesting order:' , order.id);
    }
}

module.exports = Sender;
