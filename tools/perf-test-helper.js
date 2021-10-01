import chai from '@open-wc/testing/import-wrappers/chai.js';
import { fixture } from '@open-wc/testing';

const numComponents = 1000;

export async function runTest(element) {
	return new Promise((resolve) => {

		let total = 0;
		let count = 0;
		window.d2lPerfTestInProgress = true;
		document.body.addEventListener('d2l-component-perf', (e) => {
			count++;
			total += e.detail.value;
			if (count === numComponents) {
				const avg = Math.round(total / count);
				delete window.d2lPerfTestInProgress;
				resolve(avg);
			}
		});

		for (let i = 0; i < numComponents; i++) {
			fixture(element);
		}

	});
}

export const chaiPerf = (_chai, utils) => {

	utils.addMethod(_chai.Assertion.prototype, 'performant', function perfTest(baseline) {
		// eslint-disable-next-line no-invalid-this
		const fixture = this._obj;
		const result = runTest(fixture).then(results => {
			new _chai.Assertion(results).to.be.below(baseline);
		});
		// eslint-disable-next-line no-invalid-this
		this.then = result.then.bind(result);
		// eslint-disable-next-line no-invalid-this
		return this;
	});

};

chai.use(chaiPerf);
