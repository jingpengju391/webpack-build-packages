/* eslint-disable no-undef */
const { sum } = require('../packages/index.ts')
test('sum success', () => {
  expect(sum(1, 2)).toBe(3)
})
