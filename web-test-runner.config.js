import { playwrightLauncher } from '@web/test-runner-playwright';
import { renderPerformancePlugin } from 'web-test-runner-performance';

function getPattern(type) {
	return `+(components|directives|helpers|mixins|templates)/**/*.${type}.js`;
}

export default {
	files: getPattern('test'),
	nodeResolve: true,
	groups: [
		{
			name: 'aXe',
			files: getPattern('axe'),
			browsers: [
				playwrightLauncher({
					async createPage({ context }) {
						const page = await context.newPage();
						await page.emulateMedia({ reducedMotion: 'reduce' });
						return page;
					}
				})
			]
		},
		{
			name: 'perf',
			files: getPattern('perf'),
			concurrency: 1,
			concurrentBrowsers: 1,
			browsers: [playwrightLauncher({
				async createPage({ context }) {
					const page = await context.newPage();
					await page.emulateMedia({ reducedMotion: 'reduce' });
					return page;
				}
			})],
		}
	],
	plugins: [
		renderPerformancePlugin(),
	],
	testFramework: {
		config: {
			ui: 'bdd',
			timeout: '30000',
		}
	},
	testRunnerHtml: testFramework =>
		`<html>
			<body>
				<script src="./tools/resize-observer-test-error-handler.js"></script>
				<script type="module" src="${testFramework}"></script>
			</body>
		</html>`
};
