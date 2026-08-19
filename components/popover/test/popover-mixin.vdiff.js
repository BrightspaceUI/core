import './popover.js';
import { clickElem, defineCE, expect, fixture, html, oneEvent, sendKeys, sendKeysElem } from '@brightspace-ui/testing';
import { LitElement } from 'lit';

const asyncPopoverTag = defineCE(class extends LitElement {
	static properties = {
		_loaded: { state: true }
	};
	constructor() {
		super();
		this._loaded = false;
	}
	render() {
		const content = !this._loaded ? 'Loading...' : html`<button>Loading Complete, focus here</button>`;
		return html`
			<span>
				<button @click="${this.#handleOpen}">Open</button>
				<d2l-test-popover @d2l-popover-open-async="${this.#handlePopoverOpenAsync}" class="vdiff-include">${content}</d2l-test-popover>
			</span>
		`;
	}
	#handleOpen(e) {
		this.shadowRoot.querySelector('d2l-test-popover').open(e.target);
	}
	#handlePopoverOpenAsync(e) {
		e.preventDefault();
		setTimeout(() => {
			this._loaded = true;
			e.detail.complete();
		}, 200);
	}
});

describe('popover-mixin', () => {

	const open = e => e.target.nextSibling.open(e.target);
	const viewport = { width: 700, height: 400 };

	[
		{ name: 'default', template: html`<span><button @click="${open}">Open</button><d2l-test-popover class="vdiff-include" style="max-width: 400px;">Sink me piracy Gold Road quarterdeck wherry long boat line pillage walk the plank Plate Fleet. Haul wind black spot strike colors deadlights lee Barbary Coast yo-ho-ho ballast gally Shiver me timbers. Sea Legs quarterdeck yard scourge of the seven seas coffer plunder lanyard holystone code of conduct belay.</d2l-test-popover></span>` },
		{ name: 'maxHeight', template: html`<span><button @click="${open}">Open</button><d2l-test-popover class="vdiff-include" max-height="75">Sink me piracy Gold Road quarterdeck wherry long boat line pillage walk the plank Plate Fleet. Haul wind black spot strike colors deadlights lee Barbary Coast yo-ho-ho ballast gally Shiver me timbers. Sea Legs quarterdeck yard scourge of the seven seas coffer plunder lanyard holystone code of conduct belay.</d2l-test-popover></span>` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const el = await fixture(template, { viewport });
			clickElem(el.querySelector('button'));
			await oneEvent(el, 'd2l-popover-open');
			await expect(el).to.be.golden();
		});
	});

	describe('async', () => {

		let el;
		beforeEach(async() => {
			el = await fixture(`<${asyncPopoverTag}></${asyncPopoverTag}>`, { viewport });
		});

		it('loading', async() => {
			await sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Enter');
			await expect(el.shadowRoot.querySelector('span')).to.be.golden();
		});

		it('loaded', async() => {
			sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Enter');
			await oneEvent(el, 'd2l-popover-open');
			await expect(el.shadowRoot.querySelector('span')).to.be.golden();
		});

		it('subsequent', async() => {
			sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Enter');
			await oneEvent(el, 'd2l-popover-open');
			await sendKeys('press', 'Escape');
			sendKeysElem(el.shadowRoot.querySelector('button'), 'press', 'Enter');
			await oneEvent(el, 'd2l-popover-open');
			await expect(el.shadowRoot.querySelector('span')).to.be.golden();
		});

	});

});
