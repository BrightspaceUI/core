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
					(function() {
						const e = window.onerror;
						window.onerror = function(err) {
							if (err === 'ResizeObserver loop limit exceeded') {
								console.warn('Ignored: ResizeObserver loop limit exceeded');
								return false;
							} else if (err === 'ResizeObserver loop completed with undelivered notifications.') {
								console.warn('Ignored: ResizeObserver loop completed with undelivered notifications');
								return false;
							} else {
								return e(...arguments);
							}
						};
					})();
				</script>
				<script type="module" src="${testFramework}"></script>
				<script src="./tools/perf-test-helper.js" type="module"></script>
			</body>
		</html>`
};
