
export default class PrintStatementCounter {
    private count: number;

    constructor() {
        this.count = 0;
    }

    getAndIncrement() {
        return this.count++;
    }

    reset(n: number) {
        this.count = n;
    }

}
