import test from 'ava';
import { greeting } from '../app/scripts/main.js'

test('Say Allo!', t => {
  t.is(greeting(), '\'Allo \'Allo!');
});