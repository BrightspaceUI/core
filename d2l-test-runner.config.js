import { reporter as testReporter } from '@d2l/test-reporting/reporters/web-test-runner.js';
import { defaultReporter } from '@web/test-runner';

const pattern = type => `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`;

export default {
	reporters: [
		defaultReporter(),
		testReporter({
			experience: 'Test',
			tool: 'Test',
			type: {
				default: 'Unit',
				aXe: 'Accessibility'
			},
			debug: true
		})
	],
	pattern,
	groups: [{
		name: 'aXe',
		files: pattern('axe'),
		browsers: ['chrome']
	}]
};
