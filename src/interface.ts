import Environment from './environment';

export interface Egal {
    equals(rhs) : boolean;
}

export interface Eval extends Egal {
    eval(env : Environment, args) : Eval;
}


export interface Bindings {
    [propName: string]: Eval;
}