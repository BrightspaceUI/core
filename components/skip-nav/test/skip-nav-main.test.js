import '../skip-nav-main.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';

const mainFixture = html`<d2l-skip-nav-main></d2l-skip-nav-main>`;

function getAnchor(elem) {
	return elem.shadowRoot.querySelector('d2l-skip-nav-custom').shadowRoot.querySelector('a');
}

describe('d2l-skip-nav-main', () => {

	describe('events', () => {

		let elem, anchor;
		beforeEach(async() => {
			elem = await fixture(mainFixture);
			anchor = getAnchor(elem);
		});

		it('should fire click event when clicked with mouse', async() => {
			const p = oneEvent(elem, 'click');
			await focusElem(anchor);
			clickElem(anchor);
			await p;
		});

		it('should fire click event when ENTER is pressed', async() => {
			const p = oneEvent(elem, 'click');
			sendKeysElem(anchor, 'press', 'Enter');
			await p;
		});

		it('should delegate focus to anchor', async() => {
			await focusElem(elem);
			expect(getComposedActiveElement()).to.equal(anchor);
		});

	});

	describe('skip logic', () => {

		it('should focus on main element if present', async() => {
			const elem = await fixture(html`
				<div>
					${mainFixture}
					<main>main1</main>
					<div role="main">main2</div>
					<h1>heading</h1>
				</div>
			`);
			const anchor = getAnchor(elem.querySelector('d2l-skip-nav-main'));
			await sendKeysElem(anchor, 'press', 'Enter');
			expect(getComposedActiveElement()).to.equal(elem.querySelector('main'));
		});

		it('should focus on role="main" element if no main', async() => {
			const elem = await fixture(html`
				<div>
					${mainFixture}
					<div role="main">main2</div>
					<h1>heading</h1>
				</div>
			`);
			const anchor = getAnchor(elem.querySelector('d2l-skip-nav-main'));
			await sendKeysElem(anchor, 'press', 'Enter');
			expect(getComposedActiveElement()).to.equal(elem.querySelector('[role="main"]'));
		});

		it('should focus on h1 element if no main or role="main"', async() => {
			const elem = await fixture(html`
				<div>
					${mainFixture}
					<h1>heading</h1>
				</div>
			`);
			const anchor = getAnchor(elem.querySelector('d2l-skip-nav-main'));
			await sendKeysElem(anchor, 'press', 'Enter');
			expect(getComposedActiveElement()).to.equal(elem.querySelector('h1'));
		});

		it('should dispatch "d2l-skip-nav-main-fail" event if no focus targets are found', async() => {
			const elem = await fixture(mainFixture);
			const anchor = getAnchor(elem);
			sendKeysElem(anchor, 'press', 'Enter');
			await oneEvent(elem, 'd2l-skip-nav-main-fail');
		});

	});

});
