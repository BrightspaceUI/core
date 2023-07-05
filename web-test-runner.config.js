import { createConfig, getBrowsers } from '@brightspace-ui/testing/wtr-config.js';

const pattern = type => `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`;

export default createConfig({
	concurrentBrowsers: 3,
	pattern,
	groups: [{
		name: 'aXe',
		files: pattern('axe'),
		browsers: getBrowsers(['chromium'])
	}]
});
