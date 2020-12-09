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
				os: 'Windows',
				os_version: '10',
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
