import { createConfig, getBrowsers } from '@brightspace-ui/testing';

const pattern = type => `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`;

export default createConfig({
	pattern,
	vdiff: true,
	groups: [{
		name: 'aXe',
		files: pattern('axe'),
		browsers: getBrowsers(['chromium'])
	}]
});
