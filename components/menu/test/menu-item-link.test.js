import '../menu-item-link.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';

describe('d2l-menu-item-link', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-menu-item-link');
		});

		it('should sprout "aria-label"', async() => {
			// without explicit aria-label, Voiceover on iOS cannot find nested label inside <a> element
			const elem = await fixture(html`<d2l-menu-item-link text="link text"></d2l-menu-item-link>`);
			expect(elem.getAttribute('aria-label')).to.equal('link text');
		});

		it('should sprout "aria-label" with description text', async() => {
			const elem = await fixture(html`<d2l-menu-item-link text="link text" description="no this text"></d2l-menu-item-link>`);
			expect(elem.getAttribute('aria-label')).to.equal('no this text');
		});

		it('internal anchor element is not focusable', async() => {
			const elem = await fixture(html`<d2l-menu-item-link text="link text"></d2l-menu-item-link>`);
			expect(elem.shadowRoot.querySelector('a').getAttribute('tabindex')).to.equal('-1');
		});
	});

	describe('events', () => {
		it('dispatches click and "d2l-menu-item-select" events when item clicked', async() => {
			const elem = await fixture(html`<d2l-menu-item-link text="link text"></d2l-menu-item-link>`);
			clickElem(elem);
			const [e, _] = await Promise.all([oneEvent(document, 'click'), oneEvent(elem, 'd2l-menu-item-select')]);
			expect(e.target).to.equal(elem);
		});

		it('dispatches click and "d2l-menu-item-select" events when enter key pressed on item', async() => {
			const elem = await fixture(html`<d2l-menu-item-link text="link text"></d2l-menu-item-link>`);
			sendKeysElem(elem, 'press', 'Enter');
			const [e, _] = await Promise.all([oneEvent(document, 'click'), oneEvent(elem, 'd2l-menu-item-select')]);
			expect(e.target).to.equal(elem);
		});

		it('dispatches click and "d2l-menu-item-select" events when space key pressed on item', async() => {
			const elem = await fixture(html`<d2l-menu-item-link text="link text"></d2l-menu-item-link>`);
			sendKeysElem(elem, 'press', 'Space');
			const [e, _] = await Promise.all([oneEvent(document, 'click'), oneEvent(elem, 'd2l-menu-item-select')]);
			expect(e.target).to.equal(elem);
		});
	});

});
