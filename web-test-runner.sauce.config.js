import config from './web-test-runner.config.js';
import { createSauceLabsLauncher } from '@web/test-runner-saucelabs';

const sauceLabsOptions = {
	// eslint-disable-next-line no-undef
	user: process.env.SAUCE_USERNAME,
	// eslint-disable-next-line no-undef
	key: process.env.SAUCE_ACCESS_KEY,
};

const sauceLabsCapabilities = {
	name: '@brightspace-ui/core unit tests',
	// eslint-disable-next-line no-undef
	build: `@brightspace-ui/core ${process.env.GITHUB_REF ?? 'local'} build ${process.env.GITHUB_RUN_NUMBER ?? ''}`
};

const sauceLabsLauncher = createSauceLabsLauncher(
	sauceLabsOptions,
	sauceLabsCapabilities
);

const extraOptions = {
	idleTimeout: 500 // default 90
};

config.browsers = [
	sauceLabsLauncher({
		browserName: 'chrome',
		browserVersion: 'latest',
		platformName: 'macOS 11.00',
		'sauce:options': extraOptions
	}),
	sauceLabsLauncher({
		browserName: 'firefox',
		browserVersion: 'latest',
		platformName: 'macOS 11.00',
		'sauce:options': extraOptions
	}),
	sauceLabsLauncher({
		browserName: 'safari',
		browserVersion: 'latest',
		platformName: 'macOS 11.00',
		'sauce:options': extraOptions
	}),
	sauceLabsLauncher({
		browserName: 'microsoftedge',
		browserVersion: 'latest',
		platformName: 'Windows 10',
		'sauce:options': extraOptions
	}),
];
// how long a browser can take to start up before failing
// defaults to 30000 (30 sec)
config.browserStartTimeout = 60000;
// Concurrent browsers
// Our SauceLabs account has a max of 4
config.concurrentBrowsers = 4;
// Concurrent tests in a single browser
// Many of our tests don't like being run in parallel so for now this must be 1
config.concurrency = 1;
// how long a test file can take to load
// defaults to 20000 (20 sec)
config.testsStartTimeout = 60000;

export default config;
