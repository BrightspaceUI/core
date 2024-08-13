import { fixture, html, expect } from '@brightspace-ui/testing';
import { Localize, generateLink, generateTooltipHelp, localizeMarkup } from '../localize-mixin.js';
import { restore, stub } from 'sinon';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const resources = {
	en: {
		basic: '{employerName} is my employer'
	},
	'en-gb': {
		basic: '{employerName} is my employer, but British!'
	}
};

describe('Localize', () => {

	let elem, localizer, runCount, updatePromise;
	beforeEach(async() => {
		elem = await fixture(html`<div></div>`);
		runCount = 0;
		localizer = new Localize({
			importFunc: async lang => await new Promise(r => setTimeout(() => r(resources[lang]), 50)),
			onResourcesChange: render
		});

		let resolve;
		updatePromise = new Promise(r => resolve = r);
		function render() {
			elem.innerHTML = localizer.localize('basic', { employerName: 'D2L' });
			if (runCount) resolve();
			runCount++;
		}
	});

	afterEach(() => {
		localizer.disconnect();
	});

	it(`runs onResourcesChange when ready`, async() => {
		expect(elem.innerText).to.equal('');
		await localizer.ready;
		expect(elem.innerText).to.equal('D2L is my employer');
		expect(runCount).to.equal(1);
	});

	it(`run onResourcesChange when the document locale changes`, async() => {
		await localizer.ready;
		expect(elem.innerText).to.equal('D2L is my employer');
		document.documentElement.lang = 'en-gb';
		await updatePromise;
		expect(elem.innerText).to.equal('D2L is my employer, but British!');
		expect(runCount).to.equal(2);
	});

});
