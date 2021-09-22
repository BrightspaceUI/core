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
					window.addEventListener('error', (err) => {
						if (err.message.includes('ResizeObserver')) {
							err.stopImmediatePropagation();
						}
					});
				</script>
				<script type="module" src="${testFramework}"></script>
				<script src="./tools/perf-test-helper.js" type="module"></script>
			</body>
		</html>`
};
