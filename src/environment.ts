import { Symb } from './atom';
import { Bindings, Eval } from './interface';
import { Litsp } from './litsp';

class Environment {
    private parent: Environment;
    binds : Bindings;
    level: number;

    constructor(parent = undefined, binds:Bindings = {}) {
        this.binds = binds;

        this.parent = parent;

        if (parent) {
            this.level = parent.level + 1;
        } else {
            this.level = 0;
        }
    }

    public get(key: Symb | string) {
        let k;
        if (key instanceof Symb) {
            k = key.data;
        } else {
            k = key;
        }
        if (this.binds[k]) {
            return this.binds[k];
        } else if (this.parent) {
            return this.parent.get(key);
        } else {
            throw new Error("Invalid symbol " + k);
        }
    }

    public set(key: Symb, value: Eval | Litsp) {
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

    toString(): string {
        let s = "Environment ${this.level}\n";

        for (let key in this.binds) {
            s += `\t${key} : ${this.binds[key]}\n`;
        }

        return s;
    }
}

export default Environment;