/* eslint-env node */
import { createSauceLabsLauncher } from '@web/test-runner-saucelabs';

const sauceLabsLauncher = createSauceLabsLauncher({
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY
});

const sharedCapabilities = {
	'sauce:options': {
		name: 'Brightspace UI Core Unit Tests',
		build: process.env.TRAVIS_BUILD_NUMBER,
		idleTimeout: 500
	}
};

// const customLaunchers = [
// 	sauceLabsLauncher({
// 		...sharedCapabilities,
// 		browserName: 'chrome',
// 		browserVersion: 'latest',
// 		platformName: 'macOS 10.15',
// 	})
// ];

export default {
	files: '+(components|helpers|mixins|templates)/**/*.test.js',
	nodeResolve: true,
	concurrentBrowsers: 4,
	browsers: [
		sauceLabsLauncher({
			...sharedCapabilities,
			browserName: 'chrome',
			browserVersion: 'latest',
			platformName: 'Windows 10',
		})
	],
	testFramework: {
		config: {
			timeout: '10000',
		},
	}
};
