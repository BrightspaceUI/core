import { argv } from 'node:process';
import { defaultReporter } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualDiff } from './visual-diff-plugin.js';
import { visualDiffReporter } from './visual-diff-reporter.js';

const visualDiffConfig = {
	plugins: [
		visualDiff()
	],
	reporters: [
		defaultReporter(),
		visualDiffReporter()
	]
};

function getBrowsers() {
	const browsers = ['chromium'];
	if (argv.includes('firefox')) {
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

function getGroup(group, { pattern, browsers }) {
	switch (group) {
		case 'aXe':
			return {
				name: 'aXe',
				files: pattern('axe'),
				browsers: [
					playwrightLauncher({
						async createPage({ context }) {
							const page = await context.newPage();
							await page.emulateMedia({ reducedMotion: 'reduce' });
							return page;
						}
					})
				]
			};
		case 'visual-diff':
			return {
				name: 'visual-diff',
				files: pattern('vdiff'),
				browsers,
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
			};
	}
}

const supportedGroups = ['aXe', 'visual-diff'];

export function generateConfig({
	pattern = type => `./**/*.${type}.js`,
	groups = ['aXe', 'visual-diff'],
	browsers = getBrowsers()
} = {}) {

	const fullGroups = groups
		.filter(g => supportedGroups.includes(g))
		.map(g => getGroup(g, { pattern, browsers }));

	return {
		files: pattern('test'),
		nodeResolve: true,
		groups: fullGroups,
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
			</html>`,
		...(groups.includes('visual-diff') ? visualDiffConfig : {})
	};
}
