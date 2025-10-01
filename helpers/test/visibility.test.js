import { expect, fixture, html } from '@brightspace-ui/testing';
import { ensureElementVisible } from '../visibility.js';
import sinon from 'sinon';

describe('helpers/visibility', () => {
	describe('ensureElementVisible', () => {
		let mockScrollTo, originalScrollTo;

		beforeEach(() => {
			originalScrollTo = window.scrollTo;
			mockScrollTo = sinon.stub();
			window.scrollTo = mockScrollTo;
		});

		afterEach(() => {
			window.scrollTo = originalScrollTo;
		});

		it('should not scroll when element is already visible and not hidden by sticky headers', async() => {
			const container = await fixture(html`<div style="height: 400px; overflow: auto;"><button id="test-btn">Visible Button</button></div>`);
			const button = container.querySelector('#test-btn');
			sinon.stub(button, 'getBoundingClientRect').returns({ top: 100, bottom: 130, left: 10, right: 100 });
			Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
			container.scrollTo = mockScrollTo;
			ensureElementVisible(0, container, button);
			expect(mockScrollTo).to.not.have.been.called;
		});

		it('should scroll when element is hidden behind sticky headers', async() => {
			const container = await fixture(html`<div style="height: 400px; overflow: auto;"><button id="test-btn">Hidden Button</button></div>`);
			const button = container.querySelector('#test-btn');
			sinon.stub(button, 'getBoundingClientRect').returns({ top: 45, bottom: 75, left: 10, right: 100 });
			Object.defineProperty(container, 'scrollTop', { value: 100, writable: true });
			container.scrollTo = mockScrollTo;
			Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
			ensureElementVisible(50, container, button);
			expect(mockScrollTo).to.have.been.called;
			const scrollCall = mockScrollTo.getCall(0);
			expect(scrollCall.args[0]).to.have.property('top');
			expect(scrollCall.args[0]).to.have.property('behavior');
		});

		it('should calculate correct scroll position with sticky offset', async() => {
			const container = await fixture(html`<div style="height: 400px; overflow: auto;"><button id="test-btn">Test Button</button></div>`);
			const button = container.querySelector('#test-btn');
			sinon.stub(button, 'getBoundingClientRect').returns({ top: 30, bottom: 60, left: 10, right: 100 });
			Object.defineProperty(container, 'scrollTop', { value: 200, writable: true });
			container.scrollTo = mockScrollTo;
			Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
			const stickyOffset = 80;
			ensureElementVisible(stickyOffset, container, button);
			expect(mockScrollTo).to.have.been.called;
			const scrollCall = mockScrollTo.getCall(0);
			expect(scrollCall.args[0].top).to.equal(136);
		});

		it('should handle negative scroll positions correctly', async() => {
			const container = await fixture(html`<div style="height: 400px; overflow: auto;"><button id="test-btn">Test Button</button></div>`);
			const button = container.querySelector('#test-btn');
			sinon.stub(button, 'getBoundingClientRect').returns({ top: 150, bottom: 180, left: 10, right: 100 });
			Object.defineProperty(container, 'scrollTop', { value: 10, writable: true });
			container.scrollTo = mockScrollTo;
			Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
			ensureElementVisible(200, container, button);
			expect(mockScrollTo).to.have.been.called;
			const scrollCall = mockScrollTo.getCall(0);
			expect(scrollCall.args[0].top).to.be.at.least(0);
		});

		it('should account for focus ring buffer in calculations', async() => {
			const container = await fixture(html`<div style="height: 400px; overflow: auto;"><button id="test-btn">Test Button</button></div>`);
			const button = container.querySelector('#test-btn');
			sinon.stub(button, 'getBoundingClientRect').returns({ top: 50, bottom: 80, left: 10, right: 100 });
			Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
			container.scrollTo = mockScrollTo;
			Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
			const stickyOffset = 50;
			ensureElementVisible(stickyOffset, container, button);
			expect(mockScrollTo).to.have.been.called;
		});
	});
});
