import './popover.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('popover-mixin', () => {

	const open = e => e.target.nextSibling.open(e.target);

	[
		{ name: 'default', template: html`<span><button @click="${open}">Open</button><d2l-test-popover class="vdiff-include" style="max-width: 400px;">Sink me piracy Gold Road quarterdeck wherry long boat line pillage walk the plank Plate Fleet. Haul wind black spot strike colors deadlights lee Barbary Coast yo-ho-ho ballast gally Shiver me timbers. Sea Legs quarterdeck yard scourge of the seven seas coffer plunder lanyard holystone code of conduct belay.</d2l-test-popover></span>` },
		{ name: 'maxHeight', template: html`<span><button @click="${open}">Open</button><d2l-test-popover class="vdiff-include" max-height="75">Sink me piracy Gold Road quarterdeck wherry long boat line pillage walk the plank Plate Fleet. Haul wind black spot strike colors deadlights lee Barbary Coast yo-ho-ho ballast gally Shiver me timbers. Sea Legs quarterdeck yard scourge of the seven seas coffer plunder lanyard holystone code of conduct belay.</d2l-test-popover></span>` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const el = await fixture(template, { viewport: { width: 700, height: 400 } });
			clickElem(el.querySelector('button'));
			await oneEvent(el, 'd2l-popover-open');
			await expect(el).to.be.golden();
		});
	});

});
