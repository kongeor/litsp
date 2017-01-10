import Environment from './environment';

export interface Eval {
    eval(env : Environment, args) : Eval;
}

export interface Egal {
    equals(rhs) : boolean;
}

export interface Bindings {
    [propName: string]: Eval;
}