class Environment {
    private parent: Environment;
    private binds;
    private level: number;

    constructor(parent = undefined, binds = {}) {
        this.binds = binds;

        this.parent = parent;

        if (parent) {
            this.level = parent.level + 1;
        } else {
            this.level = 0;
        }
    }

    public get(key) {
        if (this.binds[key]) {
            return this.binds[key];
        } else if (this.parent) {
            return this.parent.get(key);
        } else {
            throw new Error("Invalid symbol " + key);
        }
    }

    public set(key, value) {
        if (this.binds[key]) {
            this.binds[key] = value;
        } else if (self.parent) {
            this.parent.set(key, value);
        } else {
            this.binds[key] = value;
        }
    }

    public definedp(key) : boolean {
        return !!this.binds[key];
    }

    public push(binds) : Environment {
        return new Environment(this, binds);
    }

    public pop() : Environment {
        return this.parent;
    }
}

export default Environment;