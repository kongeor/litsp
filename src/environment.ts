import { Symb } from './atom';
import { Bindings, Eval } from './interface';

class Environment {
    private parent: Environment;
    private binds : Bindings;
    private level: number;

    constructor(parent = undefined, binds:Bindings = {}) {
        this.binds = binds;

        this.parent = parent;

        if (parent) {
            this.level = parent.level + 1;
        } else {
            this.level = 0;
        }
    }

    public get(key: Symb) {
        if (this.binds[key.data]) {
            return this.binds[key.data];
        } else if (this.parent) {
            return this.parent.get(key);
        } else {
            throw new Error("Invalid symbol " + key);
        }
    }

    public set(key: Symb, value: Eval) {
        if (this.binds[key.data]) {
            this.binds[key.data] = value;
        } else if (this.parent) {
            this.parent.set(key, value);
        } else {
            this.binds[key.data] = value;
        }
    }

    public definedp(key) : boolean {
        return !!this.binds[key];
    }

    public push(binds:Bindings = {}) : Environment {
        return new Environment(this, binds);
    }

    public pop() : Environment {
        return this.parent;
    }
}

export default Environment;