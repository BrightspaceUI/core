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
				<script>
					window.onerror = function(err) {
						console.log('onerror', err, err.includes('ResizeObserver'));
						if (err.includes('ResizeObserver')) {
							console.warn('Ignored: ResizeObserver loop limit exceeded');
							return true;
						}
					};
				</script>
				<script type="module" src="${testFramework}"></script>
				<script src="./tools/perf-test-helper.js" type="module"></script>
			</body>
		</html>`
};
