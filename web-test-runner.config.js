import { playwrightLauncher } from '@web/test-runner-playwright';

function getPattern(type) {
	return `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`;
}

export default {
	files: /*getPattern('test')*/'components/inputs/test/input-date.test.js',
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
		}
	],
	testFramework: {
		config: {
			ui: 'bdd',
			timeout: '20000',
		}
	},
	testRunnerHtml: testFramework =>
		`<html lang="en">
			<body>
				<script src="./tools/resize-observer-test-error-handler.js"></script>
				<script type="module" src="${testFramework}"></script>
			</body>
		</html>`
};
