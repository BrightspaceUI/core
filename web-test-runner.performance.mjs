// web-test-runner.performance.mjs
import { bundlePerformancePlugin } from 'web-test-runner-performance';
import { defaultReporter } from '@web/test-runner';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
function getPattern(type) {
	return `+(components|directives|helpers|mixins|templates)/**/*.${type}.js`;
}
export default ({
	concurrency: 1,
	concurrentBrowsers: 1,
	nodeResolve: true,
	testsFinishTimeout: 20000,
	files: [getPattern('perf')],
	browsers: [playwrightLauncher({ product: 'chromium', launchOptions: { headless: false } })],
	reporters: [
		defaultReporter({ reportTestResults: true, reportTestProgress: true })
	],
	plugins: [
		esbuildPlugin({ ts: true, json: true, target: 'auto', sourceMap: true }),
		bundlePerformancePlugin(),
	],
});
