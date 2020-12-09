/* eslint-env node */
import { browserstackLauncher } from '@web/test-runner-browserstack';

const sharedCapabilities = {
	'browserstack.user': process.env.BROWSERSTACK_USERNAME,
	'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
	build: `build ${process.env.GITHUB_RUN_NUMBER || 'unknown'}`,
	project: 'Brightspace UI Core Unit Tests',
	name: 'Unit tests'
};

export default {
	concurrentBrowsers: 5,
	files: '+(components|helpers|mixins|templates)/**/*.test.js',
	nodeResolve: true,
	browsers: [
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
				browserName: 'Firefox',
				os: 'OS X',
				os_version: 'Catalina',
			},
		}),
		browserstackLauncher({
			capabilities: {
				...sharedCapabilities,
				browserName: 'Safari',
				os: 'OS X',
				os_version: 'Catalina',
			},
		}),
		browserstackLauncher({
			capabilities: {
				...sharedCapabilities,
				browserName: 'Edge',
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
				os_version: '10'
			},
		})
	],
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
