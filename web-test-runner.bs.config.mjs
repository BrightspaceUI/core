/* eslint-env node */
import { browserstackLauncher } from '@web/test-runner-browserstack';

const sharedCapabilities = {
	'browserstack.user': process.env.BROWSER_STACK_USERNAME,
	'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,
	project: 'Brightspace UI Core Unit Tests',
	name: 'Unit tests',
	build: process.env.TRAVIS_BUILD_NUMBER,
};

// const sharedCapabilities = {
// 	'sauce:options': {
// 		name: 'Brightspace UI Core Unit Tests',
// 		build: process.env.TRAVIS_BUILD_NUMBER,
// 		idleTimeout: 500
// 	}
// };

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
		// create a browser launcher per browser you want to test
		// you can get the browser capabilities from the browserstack website
		browserstackLauncher({
			capabilities: {
				...sharedCapabilities,
				browserName: 'Chrome',
				os: 'OS X',
				os_version: 'Catalina',
			},
		}),

		browserstackLauncher({
			capabilities: {
				...sharedCapabilities,
				browserName: 'Safari',
				browser_version: 'latest',
				os: 'OS X',
				os_version: 'High Sierra',
			},
		}),
	],
	testFramework: {
		config: {
			ui: 'bdd',
			timeout: '10000',
		},
	},
	browserDisconnectTimeout: 3e5, // default 2000
	browserDisconnectTolerance: 3, // default 0
	browserSocketTimeout: 1.2e5, // default 20000
	browserNoActivityTimeout: 3e5, // default 10000
	captureTimeout: 3e5, // default 60000
};
