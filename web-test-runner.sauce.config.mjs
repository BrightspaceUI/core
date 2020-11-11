/* eslint-env node */
import { createSauceLabsLauncher } from '@web/test-runner-saucelabs';

const sauceLabsLauncher = createSauceLabsLauncher({
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY
});

const sharedCapabilities = {
	'sauce:options': {
		name: 'Brightspace UI Core Unit Tests',
		build: `core ${process.env.GITHUB_REF ?? 'local'} build ${
			process.env.GITHUB_RUN_NUMBER ?? ''
		}`,
		idleTimeout: 500
	}
};

const customLaunchers = [
	sauceLabsLauncher({
		...sharedCapabilities,
		browserName: 'chrome',
		browserVersion: 'latest',
		platformName: 'macOS 10.15',
	})
];

export default {
	concurrentBrowsers: 4,
	browsers: customLaunchers
};
