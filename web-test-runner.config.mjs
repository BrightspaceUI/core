import { chromeLauncher } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';

function getPattern(type) {
	return `+(components|directives|helpers|mixins|templates)/**/*.${type}.js`;
}

export default {
	browsers: [chromeLauncher({ launchOptions: { args: ['--no-sandbox'] } })],
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
			files: getPattern('perf')
		}
	],
	testFramework: {
		config: {
			ui: 'bdd',
			timeout: '10000',
		}
	},
	testRunnerHtml: testFramework =>
		`<html>
			<body>
				<script src="./tools/resize-observer-test-error-handler.js"></script>
				<script type="module" src="${testFramework}"></script>
				<script src="./tools/perf-test-helper.js" type="module"></script>
			</body>
		</html>`
};
