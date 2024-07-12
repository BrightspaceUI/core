import './popover.js';
import { aTimeout, expect, fixture, focusElem, html, nextFrame, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('popover-mixin', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-test-popover');
		});

	});

	describe('events', () => {

		['open', 'toggleOpen'].forEach(method => {

			it(`should fire the open event when opened with ${method}`, async() => {
				const elem = await fixture('<d2l-test-popover></d2l-test-popover>');
				setTimeout(() => elem[method]());
				await oneEvent(elem, 'd2l-popover-open');
			});

		});

		it('should fire the open event when initialized in opened state', async() => {
			const elem = await fixture('<div></div>');
			let fired = false;
			elem.addEventListener('d2l-popover-open', () => fired = true);
			const popover = document.createElement('d2l-test-popover');
			popover.open();
			elem.appendChild(popover);
			await nextFrame();
			expect(fired).to.be.true;
		});

		['close', 'toggleOpen'].forEach(method => {

			it(`should fire the close event when closed with ${method}`, async() => {
				const elem = await fixture('<d2l-test-popover opened></d2l-test-popover>');
				setTimeout(() => elem[method]());
				await oneEvent(elem, 'd2l-popover-close');
			});

		});

		it('should not fire the close event when initialized in closed state', async() => {
			const elem = await fixture('<div></div>');
			let fired = false;
			elem.addEventListener('d2l-popover-close', () => fired = true);
			const popover = document.createElement('d2l-test-popover');
			elem.appendChild(popover);
			await nextFrame();
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
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(elem.querySelector('#focusable-outside')));
			await oneEvent(popover, 'd2l-popover-close');
			expect(popover.opened).to.be.false;
		});

		it('should close when element outside is clicked', async() => {
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => elem.querySelector('#non-focusable-outside').click());
			await oneEvent(popover, 'd2l-popover-close');
			expect(popover.opened).to.be.false;
		});

		it('should not close when no-auto-close and element outside receives focus', async() => {
			popover.noAutoClose = true;
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(elem.querySelector('#focusable-outside')));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when no-auto-close and element outside is clicked', async() => {
			popover.noAutoClose = true;
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => elem.querySelector('#non-focusable-outside').click());
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when ancestor element receives focus', async() => {
			elem.setAttribute('tabindex', '0');
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(elem));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when element inside popover receives focus', async() => {
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => focusElem(popover.querySelector('button')));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when non-interactive element inside popover is clicked', async() => {
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			setTimeout(() => popover.querySelector('span').click());
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		it('should not close when opener receives focus', async() => {
			await focusElem(elem.querySelector('#focusable-outside')); // focus as if this is opener
			setTimeout(() => popover.open());
			await oneEvent(popover, 'd2l-popover-open');
			await focusElem(popover.querySelector('button'));
			setTimeout(() => focusElem(elem.querySelector('#focusable-outside')));
			await aTimeout(100);
			expect(popover.opened).to.be.true;
		});

		[false, true].forEach(noAutoClose => {

			it(`should close when ${noAutoClose ? 'no-auto-close and' : ''} ESC key is pressed`, async() => {
				popover.noAutoClose = noAutoClose;
				setTimeout(() => popover.open());
				await oneEvent(popover, 'd2l-popover-open');

				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 27;

				setTimeout(() => document.dispatchEvent(eventObj));
				await oneEvent(popover, 'd2l-popover-close');

				expect(popover.opened).to.be.false;
			});

		});

	});

	describe('auto-focus', () => {

		['open', 'toggleOpen'].forEach(method => {

			it(`should focus on descendant when opened with ${method}`, async() => {
				const elem = await fixture(html`<d2l-test-popover><button>shiny</button></d2l-test-popover>`);
				await elem[method]();
				await nextFrame();
				expect(document.activeElement).to.equal(elem.querySelector('button'));
			});

			it(`should focus on descendant when opened with ${method} and applyFocus is true`, async() => {
				const elem = await fixture(html`<d2l-test-popover><button>shiny</button></d2l-test-popover>`);
				await elem[method](true);
				await nextFrame();
				expect(document.activeElement).to.equal(elem.querySelector('button'));
			});

			it(`should not focus on descendant when opened with ${method} and applyFocus is false`, async() => {
				const activeElement = document.activeElement;
				const elem = await fixture(html`<d2l-test-popover><button>shiny</button></d2l-test-popover>`);
				await elem[method](false);
				await nextFrame();
				expect(document.activeElement).to.equal(activeElement);
			});

			it(`should focus on popover when opened with ${method} and no focusable descendant`, async() => {
				const elem = await fixture(html`<d2l-test-popover><span>shiny</span></d2l-test-popover>`);
				await elem[method]();
				await nextFrame();
				expect(document.activeElement).to.equal(elem);
			});

			it(`should not focus on descendant when opened with ${method} and no-auto-focus is true`, async() => {
				const activeElement = document.activeElement;
				const elem = await fixture(html`<d2l-test-popover no-auto-focus><button>shiny</button></d2l-test-popover>`);
				await elem[method]();
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
				await popover.open();
				await nextFrame();
				await popover[method]();
				await nextFrame();
				expect(document.activeElement).to.equal(opener);
			});

		});

	});

	describe('trap-focus', () => {

		it('should not render d2l-focus-trap when trap-focus is false', async() => {
			const elem = await fixture('<d2l-test-popover></d2l-test-popover>');
			await elem.open();
			const focusTrap = elem.shadowRoot.querySelector('d2l-focus-trap');
			expect(focusTrap).to.be.null;
		});

		it('should set trap to true when popover open', async() => {
			const elem = await fixture('<d2l-test-popover trap-focus></d2l-test-popover>');
			await elem.open();
			const focusTrap = elem.shadowRoot.querySelector('d2l-focus-trap');
			await focusTrap.updateComplete;
			expect(focusTrap.trap).to.be.true;
		});

		it('should set trap to false when popover closed', async() => {
			const elem = await fixture('<d2l-test-popover trap-focus></d2l-test-popover>');
			await elem.toggleOpen();
			await elem.toggleOpen();
			const focusTrap = elem.shadowRoot.querySelector('d2l-focus-trap');
			await focusTrap.updateComplete;
			expect(focusTrap.trap).to.be.false;
		});

	});

});
