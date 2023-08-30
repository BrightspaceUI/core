import '../button.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-button', () => {

	[
		{ category: 'normal', f: html`<d2l-button>Normal Button</d2l-button>` },
		{ category: 'primary', f: html`<d2l-button primary>Primary Button</d2l-button>` }
	].forEach(({ category, f }) => {

		describe(category, () => {

			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: clickElem },
				{ name: 'disabled', action: elem => elem.disabled = true }
			].forEach(({ action, name }) => {
				it(name, async() => {
					const elem = await fixture(f);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});

		});

	});

});
