import './popover.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('popover-mixin', () => {

	[
		{ name: 'default', template: html`<d2l-test-popover style="max-width: 400px;">Sink me piracy Gold Road quarterdeck wherry long boat line pillage walk the plank Plate Fleet. Haul wind black spot strike colors deadlights lee Barbary Coast yo-ho-ho ballast gally Shiver me timbers. Sea Legs quarterdeck yard scourge of the seven seas coffer plunder lanyard holystone code of conduct belay.</d2l-test-popover>` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const el = await fixture(template, { viewport: { width: 700, height: 400 } });
			el.opened = true;
			await expect(document).to.be.golden();
		});
	});

});
