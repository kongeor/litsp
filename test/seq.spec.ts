import * as test from "tape";
import {List} from '../src/seq';

const list = new List(["a", "b", "c"]);

test('list representation', function (t) {
    t.equal(list.toString(), "(a b c)");
    t.end();
});

test('list car', function (t) {
    t.equal(list.car(), "a");
    t.end();
});

test('list cdr', function (t) {
    t.true(list.cdr().equals(new List(["b", "c"])));
    t.end();
});

test('list cons', function (t) {
    t.true(list.cons("d").equals(new List(["a", "b", "c", "d"])));
    t.end();
});

test('car of empty', function (t) {
    t.equal(new List([]).car(), undefined);
    t.end();
});

// test('cdr of empty', function (t) {
//     t.equal(new List([]).cdr(), 1);
//     t.end();
// });