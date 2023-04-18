import { argv } from 'node:process';
import { defaultReporter } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualDiff } from './tools/visual-diff-plugin.js';
import { visualDiffReporter } from './tools/visual-diff-reporter.js';

function getPattern(type) {
	return `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`;
}

function getBrowsers() {
	const browsers = ['chromium'];
	if (argv.indexOf('firefox') > -1) {
		browsers.push('firefox');
	}
	if (argv.indexOf('webkit') > -1) {
		browsers.push('webkit');
	}
	return browsers.map((b) => playwrightLauncher({
		product: b,
		createBrowserContext: ({ browser }) => browser.newContext({ deviceScaleFactor: 2, reducedMotion: 'reduce' })
	}));
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
			name: 'visual-diff',
			files: getPattern('vdiff'),
			browsers: getBrowsers(),
			testRunnerHtml: testFramework =>
				`<html lang="en">
					<head>
						<link rel="preload" href="https://s.brightspace.com/lib/fonts/0.5.0/assets/Lato-400.woff2" as="font" type="font/woff2" crossorigin>
						<link rel="preload" href="https://s.brightspace.com/lib/fonts/0.5.0/assets/Lato-700.woff2" as="font" type="font/woff2" crossorigin>
						<style>
							html {
								font-size: 20px;
							}
							body {
								background-color: #ffffff;
								margin: 0;
								padding: 30px;
							}
							body[data-theme="dark"] {
								background-color: #000000;
							}
							body[data-theme="translucent"] {
								background: repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px);
							}
						</style>
						<script type="module" src="./components/typography/typography.js"></script>
					</head>
					<body class="d2l-typography">
						<script type="module" src="${testFramework}"></script>
					</body>
				</html>`
		}
	],
	plugins: [
		visualDiff()
	],
	reporters: [
		defaultReporter(),
		visualDiffReporter()
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
