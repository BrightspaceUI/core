import '../primary-secondary.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-template-primary-secondary', () => {

	[
		{ name: 'fixed', resizable: false },
		{ name: 'resizable', resizable: true },
	].forEach((resizableTest) => {
		[
			{ name: 'default', secondaryFirst: false },
			{ name: 'secondary-first', secondaryFirst: true },
		].forEach((secondaryFirstTest) => {

			it(`${resizableTest.name} ${secondaryFirstTest.name} should pass all aXe tests`, async() => {
				const elem = await fixture(html`<d2l-template-primary-secondary ?resizable="${resizableTest.resizable}" ?secondaryFirst="${secondaryFirstTest.secondaryFirst}"></d2l-template-primary-secondary>`);
				await expect(elem).to.be.accessible();
			});

		});
	});

});
