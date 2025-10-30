import '../alert-toast.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import sinon from 'sinon';

describe('d2l-alert-toast', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-alert-toast');
		});

	});

	describe('button-press', () => {

		it('should fire "d2l-alert-toast-button-press" event when alert button is pressed', async() => {
			const el = await fixture(html`<d2l-alert-toast button-text="Click Me" open>message</d2l-alert-toast>`);
			const alert = el.shadowRoot.querySelector('d2l-alert');
			setTimeout(() => alert.dispatchEvent(new CustomEvent('d2l-alert-button-press', { bubbles: true, composed: true })));
			await oneEvent(el, 'd2l-alert-toast-button-press');
		});

	});

	describe('resize event', () => {
		it('emits resize events with correct details', async() => {
			const el = await fixture(html`<d2l-alert-toast>message</d2l-alert-toast>`);
			el.open = true;
			const e1 = await oneEvent(el, 'd2l-alert-toast-resize');
			expect(e1.detail.opening).to.be.true;
			expect(e1.detail.heightDifference).to.be.greaterThan(0);

			// Trigger height change by adding subtext
			el.subtext = 'subtext';
			const e2 = await oneEvent(el, 'd2l-alert-toast-resize');
			expect(e2.detail.opening).to.be.false;
			expect(e2.detail.heightDifference).to.be.greaterThan(0);
		});
	});

	describe('close', () => {

		it('should close when close button is clicked', async() => {
			const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
			const alert = el.shadowRoot.querySelector('d2l-alert');
			alert.dispatchEvent(new CustomEvent('d2l-alert-close'));
			await el.updateComplete;
			expect(el.open).to.be.false;
		});

		it('should fire "d2l-alert-toast-close" event when closed', async() => {
			const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
			setTimeout(() => el.open = false);
			await oneEvent(el, 'd2l-alert-toast-close');
			expect(el.open).to.be.false;
		});

		it('close event details are correct', async() => {
			const el = await fixture(html`<d2l-alert-toast open subtext="more">message</d2l-alert-toast>`);
			el.open = false;
			const e = await oneEvent(el, 'd2l-alert-toast-close');
			expect(e.detail.closing).to.be.true;
			expect(e.detail.heightDifference).to.be.below(0);
		});

		describe('auto-close timing & pause', () => {
			let clock;
			beforeEach(() => {
				clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
			});
			afterEach(() => clock.restore());

			it('auto-closes after 4s without button', async() => {
				const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
				clock.tick(3999);
				expect(el.open).to.be.true;
				clock.tick(1);
				expect(el.open).to.be.false;
			});

			it('auto-closes after 10s with button', async() => {
				const el = await fixture(html`<d2l-alert-toast button-text="Do it" open>message</d2l-alert-toast>`);
				clock.tick(9999);
				expect(el.open).to.be.true;
				clock.tick(1);
				expect(el.open).to.be.false;
			});

			it('does not auto-close when no-auto-close set', async() => {
				const el = await fixture(html`<d2l-alert-toast no-auto-close open>message</d2l-alert-toast>`);
				clock.tick(12000);
				expect(el.open).to.be.true;
			});
		});
	});

});
