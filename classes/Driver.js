class Driver {
    constructor(name) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.name = name;
        this.in_ride = false;
    }
}

module.exports = Driver;