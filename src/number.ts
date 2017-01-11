import Environment from './environment';
import { Eval, Egal } from './interface';

export class Num implements Eval, Egal {

    static readonly REGEX = /^\d+$/;

    data: number;

    constructor(data: number) {
        this.data = data;
    }

    eval(env: Environment, args = []) {
        return this;
    }

    equals(rhs) {
        if (rhs instanceof Num) {
            return this.data === rhs.data;
        }
        return false;
    }

    toString(): string {
        return "" + this.data;
    }
}