import config from './web-test-runner.config.mjs';
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
	build: `${process.env.GITHUB_REF ?? 'local'} build ${process.env.GITHUB_RUN_NUMBER ?? ''}`
};

const sauceLabsLauncher = createSauceLabsLauncher(
	sauceLabsOptions,
	sauceLabsCapabilities
);

const extraOptions = {
	idleTimeout: 500 // default 90
};

config.concurrentBrowsers = 4; // concurrent browsers
config.concurrency = 6; // concurrent tests in a single browser
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
	/*sauceLabsLauncher({
		browserName: 'microsoftedge',
		browserVersion: '18.17763',
		platformName: 'Windows 10',
		'sauce:options': extraOptions
	}),*/
];

export default config;
