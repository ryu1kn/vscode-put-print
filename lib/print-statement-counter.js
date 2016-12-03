
class PrintStatementCounter {

    constructor() {
        this._count = 0;
    }

    getAndIncrement() {
        return this._count++;
    }

    reset(number) {
        this._count = number;
    }

}

module.exports = PrintStatementCounter;
