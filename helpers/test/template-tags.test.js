import { expect } from '@brightspace-ui/testing';
import { set } from '../template-tags.js';

describe('template-tags', () => {

	describe('set', () => {
		[{
			shifted: set`
				foo
				bar
				baz
			`,
			expected:
`foo
bar
baz`
		}, {
			shifted: set`
				foo
				bar
				baz
				\t
			`,
			expected:
`foo
bar
baz
	`
		}, {
			shifted: set`
				foo
			bar
				baz
			`,
			expected:
`	foo
bar
	baz`
		}, {
			shifted:
				set`foo
					bar
					baz`,
			expected:
`foo
bar
baz`
		}, {
			shifted:
				set`	foo
					 bar
					baz`,
			expected:
`	foo
 bar
baz`
		}, {
			shifted:
			set`foo
				${'bar'}
				baz`,
			expected:
`foo
bar
baz`
		}].forEach(({ shifted, expected }, idx) => {
			it(`should shift templates left - ${idx++}`, () => {
				expect(shifted).to.equal(expected);
			});

		});
	});
});
