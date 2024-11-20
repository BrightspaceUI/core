import '../button-icon.js';
import '../button-toggle.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-button-toggle', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-toggle');
		});

	});

	describe('events', () => {

		it('dispatches d2l-button-toggle-change event not-pressed is clicked', async() => {
			const el = await fixture(html`
				<d2l-button-toggle>
					<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
					<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
				</d2l-button-toggle>
			`);
			clickElem(el.querySelector('[slot="not-pressed"]'));
			const e = await oneEvent(el, 'd2l-button-toggle-change');
			expect(e.target.pressed).to.equal(true);
		});

		it('dispatches d2l-button-toggle-change event pressed is clicked', async() => {
			const el = await fixture(html`
				<d2l-button-toggle pressed>
					<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
					<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
				</d2l-button-toggle>
			`);
			clickElem(el.querySelector('[slot="pressed"]'));
			const e = await oneEvent(el, 'd2l-button-toggle-change');
			expect(e.target.pressed).to.equal(false);
		});

		it('does not dispatch d2l-button-toggle-change event initially', async() => {
			let dispatched = false;
			const el = document.createElement('d2l-button-toggle');
			el.addEventListener('d2l-button-toggle-change', () => dispatched = true);
			document.body.appendChild(el);
			await el.updateComplete;
			expect(dispatched).to.equal(false);
		});

		it('does not dispatch d2l-button-toggle-change event if disabled buttons are clicked', async() => {
			const el = await fixture(html`
				<d2l-button-toggle>
					<d2l-button-icon slot="not-pressed" disabled icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
					<d2l-button-icon slot="pressed" disabled icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
				</d2l-button-toggle>
			`);
			let dispatched = false;
			el.addEventListener('d2l-button-toggle-change', () => dispatched = true);
			await clickElem(el.querySelector('[slot="not-pressed"]'));
			expect(el.pressed).to.equal(false);
			expect(dispatched).to.be.false;
		});

	});

	describe('consumer manages state', () => {

		let el;
		beforeEach(async() => {
			el = await fixture(html`
				<d2l-button-toggle>
					<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
					<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
				</d2l-button-toggle>
			`);
		});

		it('click with no state management', async() => {
			el.addEventListener('d2l-button-toggle-before-change', (e) => {
				e.preventDefault();
			});
			await clickElem(el.querySelector('[slot="not-pressed"]'));
			expect(el.pressed).to.equal(false);
		});

		it('click once with state management', async() => {
			el.addEventListener('d2l-button-toggle-before-change', (e) => {
				e.preventDefault();
				e.detail.update(!e.target.pressed);
			});
			clickElem(el.querySelector('[slot="not-pressed"]'));
			const e = await oneEvent(el, 'd2l-button-toggle-change');
			expect(e.target.pressed).to.equal(true);
		});
	});

});
