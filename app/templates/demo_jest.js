import { greeting } from '../app/scripts/main.js'

test('Say Allo!', () => {
  expect(greeting()).toBe('\'Allo \'Allo!');
});