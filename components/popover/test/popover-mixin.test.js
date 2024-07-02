import './popover.js';
import { expect, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('popover-mixin', () => {

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

});
