/* eslint-env node */
import { createSauceLabsLauncher } from '@web/test-runner-saucelabs';

const sauceLabsLauncher = createSauceLabsLauncher({
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY
});

const sharedCapabilities = {
	'sauce:options': {
		name: 'Unit Tests',
		idleTimeout: 500
	}
};

const customLaunchers = [
	sauceLabsLauncher({
		...sharedCapabilities,
		browserName: 'chrome',
		browserVersion: 'latest',
		platformName: 'macOS 10.15',
	}),

	sauceLabsLauncher({
		...sharedCapabilities,
		browserName: 'firefox',
		browserVersion: 'latest',
		platformName: 'macOS 10.15',
	}),

	sauceLabsLauncher({
		...sharedCapabilities,
		browserName: 'safari',
		browserVersion: 'latest',
		platformName: 'macOS 10.15',
	}),

	sauceLabsLauncher({
		...sharedCapabilities,
		browserName: 'microsoftedge',
		browserVersion: 'latest',
		platformName: 'Windows 10',
	})
];

export default {
	concurrentBrowsers: 4,
	browsers: customLaunchers
};
