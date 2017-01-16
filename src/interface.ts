import Environment from './environment';

export interface Egal {
    equals(rhs) : boolean;
}

export interface Eval extends Egal { //TODO
    data: any,
    eval(env : Environment, args?: Eval[]) : Eval;
}


export interface Bindings {
    [propName: string]: Eval;
}