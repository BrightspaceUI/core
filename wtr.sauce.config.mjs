/* eslint-env node */
import { createSauceLabsLauncher } from '@web/test-runner-saucelabs';

const sauceLabsCapabilities = {
	name: 'Brightspace UI Core Unit Tests',
	idleTimeout: 500
};

const sauceLabsLauncher = createSauceLabsLauncher({
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY
}, sauceLabsCapabilities);

export default {
	files: '+(components|helpers|mixins|templates)/**/*.test.js',
	nodeResolve: true,
	concurrentBrowsers: 4,
	browsers: [
		sauceLabsLauncher({
			browserName: 'chrome',
			browserVersion: 'latest',
			platformName: 'OS X 10.15'
		}),
		sauceLabsLauncher({
			browserName: 'firefox',
			browserVersion: 'latest',
			platformName: 'OS X 10.15'
		}),
		sauceLabsLauncher({
			browserName: 'safari',
			browserVersion: 'latest',
			platformName: 'OS X 10.15'
		}),
		sauceLabsLauncher({
			browserName: 'microsoftedge',
			browserVersion: 'latest',
			platformName: 'Windows 10'
		}),
		// sauceLabsLauncher({
		// 	browserName: 'microsoftedge',
		// 	browserVersion: '18.17763',
		// 	platformName: 'Windows 10'
		// })
	],
	testFramework: {
		config: {
			ui: 'bdd',
			timeout: '10000',
		},
	},
	browserStartTimeout: 1000 * 60 * 2,
	testsStartTimeout: 1000 * 60 * 2,
	testsFinishTimeout: 1000 * 60 * 2
};
