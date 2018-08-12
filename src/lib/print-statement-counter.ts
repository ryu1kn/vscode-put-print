
export default class PrintStatementCounter {
    private _count: number;

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
