import { Localize, localizeMarkupIntl } from '../localize-mixin.js';
import { expect } from '@brightspace-ui/testing';

const resources = {
	en: {
		basic: '{employerName} is my employer',
		html: '<spanTag>Wrapped in tags</spanTag>'
	},
	'en-gb': {
		basic: '{employerName} is my employer, but British!'
	}
};

describe('Localize', () => {

	let localizer, runCount, updatePromise;
	beforeEach(async() => {
		runCount = 0;

		let resolve;
		updatePromise = new Promise(r => resolve = r);

		localizer = new Localize({
			importFunc: async lang => await new Promise(r => setTimeout(() => r(resources[lang]), 50)),
			onResourcesChange: () => {
				if (runCount) resolve();
				runCount++;
			}
		});
	});

	afterEach(() => {
		localizer.disconnect();
	});

	describe('onResourcesChange', () => {

		it('runs when ready', async() => {
			await localizer.ready;
			expect(runCount).to.equal(1);
		});

		it('run when the document locale changes', async() => {
			await localizer.ready;
			expect(localizer.localize.resolvedLocales).to.have.keys(['en']);
			document.documentElement.lang = 'en-gb';
			await updatePromise;
			expect(runCount).to.equal(2);
			expect(localizer.localize.resolvedLocales).to.have.keys(['en-gb']);
		});

	});

	it('can localize text', async() => {
		await localizer.ready;
		const localized = localizer.localize('basic', { employerName: 'D2L' });
		expect(localized).to.equal('D2L is my employer');
	});

	it('can localize with HTML', async() => {
		await localizer.ready;
		const localized = localizer.localizeHTML('html', { spanTag: chunks => localizeMarkupIntl`<p id="my-paragraph">${chunks}</p>` });
		expect(localized).to.equal('<p id="my-paragraph">Wrapped in tags</p>');
	});

});
