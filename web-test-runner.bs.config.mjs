/* eslint-env node */
import { browserstackLauncher } from '@web/test-runner-browserstack';

const sharedCapabilities = {
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
	project: 'Brightspace UI Core Unit Tests',
	name: 'Unit tests',
	build: process.env.TRAVIS_BUILD_NUMBER,
};

const customLaunchers = [
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
			browserName: 'firefox',
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
			os_version: 'Catalina',
		},
	}),
	browserstackLauncher({
		capabilities: {
			...sharedCapabilities,
			browserName: 'Edge',
			browser_version: 'latest',
			os: 'Windows',
			os_version: '10',
		},
	}),
	browserstackLauncher({
		capabilities: {
			...sharedCapabilities,
			browserName: 'Edge',
			browser_version: '18.0',
			os: 'Windows',
			os_version: '10',
		},
	})
];

export default {
	files: '+(components|helpers|mixins|templates)/**/*.test.js',
	nodeResolve: true,
	concurrentBrowsers: 4,
	browsers: customLaunchers,
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
