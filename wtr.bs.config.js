/* eslint-env node */
import { browserstackLauncher } from '@web/test-runner-browserstack';

const sharedCapabilities = {
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
	project: 'Brightspace UI Core Unit Tests',
	name: 'Unit tests'
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
	// browserstackLauncher({
	// 	capabilities: {
	// 		...sharedCapabilities,
	// 		browserName: 'Edge',
	// 		browser_version: '18.0',
	// 		os: 'Windows',
	// 		os_version: '10',
	// 	},
	// })
];

module.exports = {
	files: '+(components|helpers|mixins|templates)/**/*.test.js',
	nodeResolve: true,
	concurrentBrowsers: 5,
	browsers: customLaunchers,
	testFramework: {
		config: {
			ui: 'bdd',
			timeout: '10000'
		},
	},
	browserStartTimeout: 300000,
	testsStartTimeout: 300000,
	testsFinishTimeout: 300000
};
