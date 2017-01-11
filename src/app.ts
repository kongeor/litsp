import Environment from "./environment";
import { TRUE, Symb } from './atom';
import { Num } from './number';
import { List } from './seq';

const data = {"a" : 1};

const env = new Environment(null, data);

const data2 = {"b" : 2};

const env2 = new Environment(env, data2);

let list = new List([new Symb("a"),
                     new String("b"),
                     new Num(3)]);

let list2 = new List([new Symb("a"),
                      new String("b"),
                      new Num(4)]);

console.log(list.equals(list2));
// console.log('yo');