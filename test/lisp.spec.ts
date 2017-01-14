import * as test from "tape";
import { Symb, TRUE, FALSE, Str } from '../src/atom';
import { Lisp } from '../src/lisp';
import { List } from '../src/seq';
import Environment from '../src/environment';

const env = new Environment();
const str1 = new Str("foo");
const str2 = new Str("bar");

const s1 = new Symb("s1");
const s2 = new Symb("s2");
const s3 = new Symb("s3");

const lisp = new Lisp();

test('cond test', t => {
    env.set(s1, FALSE);
    env.set(s2, TRUE);
    env.set(s3, str1);
    let list1 = new List([s1, s2]);
    let list2 = new List([s2, s3]);
    t.true(lisp.cond(env, [list1, list2]).equals(str1));
    t.end();
});