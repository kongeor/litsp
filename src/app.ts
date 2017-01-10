import Environment from "./environment";
import {TRUE} from './atom';

const data = {"a" : 1};

const env = new Environment(null, data);

const data2 = {"b" : 2};

const env2 = new Environment(env, data2);

console.log(TRUE.toString());

