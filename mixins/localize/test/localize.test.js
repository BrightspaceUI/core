import { Localize, localizeMarkup } from '../localize.js';
import { expect, fixture } from '@brightspace-ui/testing';

const resources = {
	en: {
		basic: '{employerName} is my employer',
		many: 'This {type} has {count} arguments',
		html: '<paragraph>Wrapped in tags</paragraph>'
	},
	'en-gb': {
		basic: '{employerName} is my employer, but British!'
	}
};

describe('Localize', () => {

	let localizer, runCount, updatePromise;
	beforeEach(async() => {
		await fixture('<div></div>');
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
		expect(runCount).to.equal(0);
		await localizer.ready;
	});

	afterEach(() => {
		localizer.disconnect();
	});

	describe('onResourcesChange', () => {

		it('has run when ready', async() => {
			expect(runCount).to.equal(1);
		});

		it('runs when the document locale changes', async() => {
			expect(localizer.localize.resolvedLocales).to.have.keys(['en']);
			document.documentElement.lang = 'en-gb';
			await updatePromise;
			expect(runCount).to.equal(2);
			expect(localizer.localize.resolvedLocales).to.have.keys(['en-gb']);
		});

	});

	describe('localize()', () => {

		it('should localize text', async() => {
			const localized = localizer.localize('basic', { employerName: 'D2L' });
			expect(localized).to.equal('D2L is my employer');
		});

		it('should accept "many params"', () => {
			const localized = localizer.localize('many', 'type', 'message', 'count', 2);
			expect(localized).to.equal('This message has 2 arguments');
		})

	});

	describe('localizeHTML()', () => {

		it('should localize, replacing tags with HTML', async() => {
			const localized = localizer.localizeHTML('html', { paragraph: chunks => localizeMarkup`<p id="my-paragraph">${chunks}</p>` });
			expect(localized).to.equal('<p id="my-paragraph">Wrapped in tags</p>');
		});

	});

});
