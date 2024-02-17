class Sender {
    constructor(name) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.name = name;
    }
}

module.exports = Sender;