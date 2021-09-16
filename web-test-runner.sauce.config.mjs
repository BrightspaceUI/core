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
	build: `@brightspace-ui/core ${process.env.GITHUB_REF ?? 'local'} build ${process.env.GITHUB_RUN_NUMBER ?? ''}`
};

const sauceLabsLauncher = createSauceLabsLauncher(
	sauceLabsOptions,
	sauceLabsCapabilities
);

config.concurrentBrowsers = 4; // concurrent browsers
config.concurrency = 6; // concurrent tests in a single browser
config.browsers = [
	sauceLabsLauncher({
		browserName: 'chrome',
		platform: 'macOS 11.00',
		version: 'latest',
	}),
	sauceLabsLauncher({
		browserName: 'firefox',
		platform: 'macOS 11.00',
		version: 'latest',
	}),
	sauceLabsLauncher({
		browserName: 'safari',
		platform: 'macOS 11.00',
		version: 'latest'
	}),
	sauceLabsLauncher({
		browserName: 'microsoftedge',
		platform: 'Windows 10',
		version: 'latest'
	}),
	/*sauceLabsLauncher({
		browserName: 'microsoftedge',
		platform: 'Windows 10',
		version: '18.17763'
	}),*/
];

export default config;
