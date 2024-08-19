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

		localizer = {};
		localizer = new Localize({
			importFunc: async lang => await new Promise(r => setTimeout(() => r(resources[lang]), 50)),
			onResourcesChange: () => {
				if (runCount) resolve();
				runCount++;
			}
		});
		expect(runCount).to.equal(0);
	});

	afterEach(() => {
		localizer.disconnect();
	});

	describe('onResourcesChange', () => {

		it('should not be set up before ready', async() => {
			expect(runCount).to.equal(0);
			expect(localizer.localize.resources).to.be.undefined;
			expect(localizer.localize.resolvedLocale).to.be.undefined;
			expect(localizer.pristine).to.be.true;
		})

		it('should have run once when ready', async() => {
			await localizer.ready;
			expect(runCount).to.equal(1);
			expect(localizer.localize.resources).to.be.an('object');
			expect(localizer.localize.resolvedLocale).to.equal('en');
			expect(localizer.pristine).to.be.false;
		});

		it('runs when the document locale changes', async() => {
			await localizer.ready;
			expect(localizer.localize.resolvedLocale).to.equal('en');
			document.documentElement.lang = 'en-gb';
			await updatePromise;
			expect(runCount).to.equal(2);
			expect(localizer.localize.resolvedLocale).to.equal('en-gb');
		});

	});

	describe('localize()', () => {

		it('should localize text', async() => {
			await localizer.ready;
			const localized = localizer.localize('basic', { employerName: 'D2L' });
			expect(localized).to.equal('D2L is my employer');
		});

		it('should accept exapnded/spread params', async() => {
			await localizer.ready;
			const localized = localizer.localize('many', 'type', 'message', 'count', 2);
			expect(localized).to.equal('This message has 2 arguments');
		})

	});

	describe('localizeHTML()', () => {

		it('should localize, replacing tags with HTML', async() => {
			await localizer.ready;
			const localized = localizer.localizeHTML('html', { paragraph: chunks => localizeMarkup`<p id="my-paragraph">${chunks}</p>` });
			expect(localized).to.equal('<p id="my-paragraph">Wrapped in tags</p>');
		});

	});

});
