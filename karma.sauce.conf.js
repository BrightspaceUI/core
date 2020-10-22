/* eslint-env node */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

const defaultPattern = '+(components|helpers|mixins|templates)/**/*.test.js';
const customLaunchers = {
	chrome: {
		base: 'SauceLabs',
		browserName: 'chrome',
		platform: 'OS X 10.15',
	},
	firefox: {
		base: 'SauceLabs',
		browserName: 'firefox',
		platform: 'OS X 10.15'
	},
	safari: {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.15'
	},
	edge: {
		base: 'SauceLabs',
		browserName: 'microsoftedge',
		platform: 'Windows 10',
		version: 'latest'
	},
	edge_legacy: {
		base: 'SauceLabs',
		browserName: 'microsoftedge',
		platform: 'Windows 10',
		version: '18.17763'
	}
};

module.exports = config => {
	const defaultConfig = createDefaultConfig(config);
	defaultConfig.browsers = []; // remove ChromeHeadless
	config.set(
		merge(defaultConfig, {
			files: [
				// runs all files ending with .test in the test folder,
				// can be overwritten by passing a --grep flag. examples:
				//
				// npm run test -- --grep test/foo/bar.test.js
				// npm run test -- --grep test/bar/*
				{ pattern: config.grep ? config.grep : defaultPattern, type: 'module' },
			],
			// see the karma-esm docs for all options
			esm: {
				// if you are using 'bare module imports' you will need this option
				nodeResolve: true,
			},
			sauceLabs: {
				testName: 'Brightspace UI Core Unit Tests',
				idleTimeout: 500 // default 90
			},
			customLaunchers: customLaunchers,
			browsers: Object.keys(customLaunchers),
			reporters: ['saucelabs'],
			browserDisconnectTimeout : 50000, // default 2000
			browserNoActivityTimeout: 300000, // default 30000
			client: {
				mocha: {
					timeout : 10000 // default 2000, for legacy-Edge
				}
			},
		}),
	);
	return config;
};
