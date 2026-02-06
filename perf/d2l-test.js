import {execSync} from 'child_process';

['fixture', 'describe'].forEach(type => {
	console.log(`Running ${type} VDiff Tests...`);
	const durations = [];
	for (let i = 0; i < 5; i++) {
		const start = Date.now();
		try {
			execSync(`npm run test:vdiff -- --filter perf-${type}`, i == 4 ? 'inherit' : 'ignore');
		} catch (e) {}
		const end = Date.now();
		durations.push(end - start);
	}
	console.log('Avg. Duration (ms):', durations.reduce((a, b) => a + b, 0) / durations.length);
})
