import '../button-icon.js';
import '../button-subtle.js';
import '../button-toggle.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, sendKeysElem } from '@brightspace-ui/testing';

describe('button-toggle', () => {

	[
		{ category: 'button-icon', template: html`<d2l-button-toggle><d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon><d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon></d2l-button-toggle>` },
		{ category: 'button-icon-pressed', template: html`<d2l-button-toggle pressed><d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon><d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon></d2l-button-toggle>` },
		{ category: 'button-subtle', template: html`<d2l-button-toggle><d2l-button-subtle slot="not-pressed" icon="tier1:lock-unlock" text="Unlocked" description="Click to lock."></d2l-button-subtle><d2l-button-subtle slot="pressed" icon="tier1:lock-locked" text="Locked" description="Click to unlock."></d2l-button-subtle></d2l-button-toggle>` },
		{ category: 'button-subtle-pressed', template: html`<d2l-button-toggle pressed><d2l-button-subtle slot="not-pressed" icon="tier1:lock-unlock" text="Unlocked" description="Click to lock."></d2l-button-subtle><d2l-button-subtle slot="pressed" icon="tier1:lock-locked" text="Locked" description="Click to unlock."></d2l-button-subtle></d2l-button-toggle>` },
		{ category: 'button-subtle-disabled', template: html`<d2l-button-toggle><d2l-button-subtle slot="not-pressed" disabled icon="tier1:lock-unlock" text="Unlocked" description="Click to lock."></d2l-button-subtle><d2l-button-subtle slot="pressed" disabled icon="tier1:lock-locked" text="Locked" description="Click to unlock."></d2l-button-subtle></d2l-button-toggle>` }
	].forEach(({ category, template }) => {

		const getActiveButton = elem => {
			if (elem.pressed) return elem.querySelector('[slot="pressed"]');
			else return elem.querySelector('[slot="not-pressed"]');
		};

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: elem => clickElem(getActiveButton(elem)) },
				{ name: 'enter', action: elem => sendKeysElem(getActiveButton(elem), 'press', 'Enter') }
			].forEach(({ action, name }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});

	});

});
