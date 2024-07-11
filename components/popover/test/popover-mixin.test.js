import './popover.js';
import { aTimeout, expect, fixture, focusElem, html, nextFrame, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('popover-mixin', () => {

	const open = (method, popover, applyFocus) => {
		if (method !== 'toggleOpen') return popover.open(applyFocus);
		else return popover.toggleOpen(applyFocus);
	};

	const close = (method, popover) => {
		if (method !== 'toggleOpen') return popover.close();
		else return popover.toggleOpen();
	};

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-test-popover');
		});

	});

	describe('events', () => {

		it('should fire the open event when the opened attribute is set to true', async() => {
			const elem = await fixture('<d2l-test-popover></d2l-test-popover>');
			elem.opened = true;
			await oneEvent(elem, 'd2l-popover-open');
		});

		it('should fire the open event when initialized in opened state', async() => {
			const elem = await fixture('<div></div>');
			let fired = false;
			elem.addEventListener('d2l-popover-open', () => fired = true);
			const popover = document.createElement('d2l-test-popover');
			popover.opened = true;
			elem.appendChild(popover);
			await popover.updateComplete;
			expect(fired).to.be.true;
		});

		it('should fire the close event when the opened attribute is set to false', async() => {
			const elem = await fixture('<d2l-test-popover opened></d2l-test-popover>');
			elem.opened = false;
			await oneEvent(elem, 'd2l-popover-close');
		});

		it('should not fire the close event when initialized in closed state', async() => {
			const elem = await fixture('<div></div>');
			let fired = false;
			elem.addEventListener('d2l-popover-close', () => fired = true);
			const popover = document.createElement('d2l-test-popover');
			elem.appendChild(popover);
			await popover.updateComplete;
			expect(fired).to.be.false;
		});

	});

	describe('auto-close', () => {

		let elem, popover;

		beforeEach(async() => {
			elem = await fixture(html`
				<div>
					<d2l-test-popover>
						<button>shiny</button>
						<span>apple</span>
					</d2l-test-popover>
					<p id="non-focusable-outside">is they anybody...</p>
					<button id="focusable-outside">out here</button>
				</div>
			`);
			popover = elem.querySelector('d2l-test-popover');
		});

		it('should close when element outside receives focus', async() => {
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(elem.querySelector('#focusable-outside')));
			await oneEvent(popover, 'd2l-popover-close');
			expect(popover.opened).to.be.false;
		});

		it('should close when element outside is clicked', async() => {
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => elem.querySelector('#non-focusable-outside').click());
			await oneEvent(popover, 'd2l-popover-close');
			expect(popover.opened).to.be.false;
		});

		it('should not close when no-auto-close and element outside receives focus', async() => {
			popover.noAutoClose = true;
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(elem.querySelector('#focusable-outside')));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when no-auto-close and element outside is clicked', async() => {
			popover.noAutoClose = true;
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => elem.querySelector('#non-focusable-outside').click());
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when ancestor element receives focus', async() => {
			elem.setAttribute('tabindex', '0');
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(elem));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when element inside popover receives focus', async() => {
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(popover.querySelector('button')));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when non-interactive element inside popover is clicked', async() => {
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => popover.querySelector('span').click());
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when opener receives focus', async() => {
			await focusElem(elem.querySelector('#focusable-outside')); // focus as if this is opener
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');
			await focusElem(popover.querySelector('button'));
			setTimeout(() => focusElem(elem.querySelector('#focusable-outside')));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should close when ESC key is pressed', async() => {
			popover.opened = true;
			await oneEvent(popover, 'd2l-popover-open');

			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keydown', true, true);
			eventObj.keyCode = 27;

			setTimeout(() => document.dispatchEvent(eventObj));
			await oneEvent(popover, 'd2l-popover-close');

			expect(popover.opened).to.be.false;
		});

	});

	describe('auto-focus', () => {

		['open', 'toggleOpen'].forEach(method => {

			it(`should focus on descendant when opened with ${method}`, async() => {
				const elem = await fixture(html`<d2l-test-popover><button>shiny</button></d2l-test-popover>`);
				await open(method, elem);
				await nextFrame();
				expect(document.activeElement).to.equal(elem.querySelector('button'));
			});

			it(`should focus on descendant when opened with ${method} and applyFocus is true`, async() => {
				const elem = await fixture(html`<d2l-test-popover><button>shiny</button></d2l-test-popover>`);
				await open(method, elem, true);
				await nextFrame();
				expect(document.activeElement).to.equal(elem.querySelector('button'));
			});

			it(`should not focus on descendant when opened with ${method} and applyFocus is false`, async() => {
				const activeElement = document.activeElement;
				const elem = await fixture(html`<d2l-test-popover><button>shiny</button></d2l-test-popover>`);
				await open(method, elem, false);
				await nextFrame();
				expect(document.activeElement).to.equal(activeElement);
			});

			it(`should focus on popover when opened with ${method} and no focusable descendant`, async() => {
				const elem = await fixture(html`<d2l-test-popover><span>shiny</span></d2l-test-popover>`);
				await open(method, elem);
				await nextFrame();
				expect(document.activeElement).to.equal(elem);
			});

			it(`should not focus on descendant when opened with ${method} and no-auto-focus is true`, async() => {
				const activeElement = document.activeElement;
				const elem = await fixture(html`<d2l-test-popover no-auto-focus><button>shiny</button></d2l-test-popover>`);
				await open(method, elem);
				await nextFrame();
				expect(document.activeElement).to.equal(activeElement);
			});

		});

		['close', 'toggleOpen'].forEach(method => {

			it(`should focus on opener when closed with ${method}`, async() => {
				const elem = await fixture(html`
					<div>
						<button id="opener"></button>
						<d2l-test-popover><button>shiny</button></d2l-test-popover>
					</div>
				`);
				const popover = elem.querySelector('d2l-test-popover');
				const opener = elem.querySelector('#opener');
				opener.focus();
				await open(method, popover);
				await nextFrame();
				await close(method, popover);
				await popover.close();
				await nextFrame();
				expect(document.activeElement).to.equal(opener);
			});

		});

	});

});
