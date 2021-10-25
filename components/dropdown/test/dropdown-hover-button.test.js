import '../dropdown-hover-button.js';
import '../dropdown-content.js';
import { aTimeout, expect, fixture, html, nextFrame, oneEvent, triggerFocusFor } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`
	<div>
		<div id="optionallyFocusable">
			<d2l-dropdown-hover-button>
				<d2l-dropdown-content>
					<p id="non_focusable_inside">a</p>
					<a id="focusable_inside" href="http://www.desire2learn.com">b</a>
				</d2l-dropdown-content>
			</d2l-dropdown-hover-button>
			<p id="non_focusable_outside">c</p>
			<button id="focusable_outside">out here</button>
		</div>
	</div>
`;

describe('d2l-dropdown-hover-button', () => {

	let dropdown, content, button, opener;

	beforeEach(async() => {
		dropdown = await fixture(normalFixture);
		content = dropdown.querySelector('d2l-dropdown-content');
		button = dropdown.querySelector('d2l-dropdown-hover-button');
		opener = button.getOpenerElement();
		await content.updateComplete;
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-dropdown-hover-button');
		});

	});

	describe('toggleOpen', () => {

		it('opens dropdown when closed', async() => {
			content.toggleOpen();
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;
		});

		it('closes dropdown when open', async() => {
			content.toggleOpen();
			await oneEvent(content, 'd2l-dropdown-open');

			setTimeout(() => content.toggleOpen());
			await oneEvent(content, 'd2l-dropdown-close');

			expect(content.opened).to.be.false;
		});

	});

	describe('hover', () => {

		it('opens dropdown when mouse hovers on opener', async() => {
			opener.dispatchEvent(new Event('mouseenter'));
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;
		});

		it('closes dropdown when mouse leaves opener', async() => {
			opener.dispatchEvent(new Event('mouseenter'));
			await oneEvent(content, 'd2l-dropdown-open');

			opener.dispatchEvent(new Event('mouseleave'));
			setTimeout(() => dropdown.querySelector('#non_focusable_outside').dispatchEvent(new Event('mouseenter')));
			await oneEvent(content, 'd2l-dropdown-close');

			expect(content.opened).to.be.false;
		});

		it('does not close when hovering to content', async() => {
			opener.dispatchEvent(new Event('mouseenter'));
			await oneEvent(content, 'd2l-dropdown-open');

			opener.dispatchEvent(new Event('mouseleave'));
			setTimeout(() => content.dispatchEvent(new Event('mouseenter')));
			await aTimeout(600);

			expect(content.opened).to.be.true;
		});

		it('dropdown closes when mouse leaves content', async() => {
			opener.dispatchEvent(new Event('mouseenter'));
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;

			opener.dispatchEvent(new Event('mouseleave'));
			content.dispatchEvent(new Event('mouseenter'));
			await aTimeout(600);
			expect(content.opened).to.be.true;

			content.dispatchEvent(new Event('mouseleave'));
			await oneEvent(content, 'd2l-dropdown-close');
			expect(content.opened).to.be.false;
		});

		it('clicking outside closes dropdown', async() => {
			opener.dispatchEvent(new Event('mouseenter'));
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;

			setTimeout(() => dropdown.querySelector('#non_focusable_outside').click());
			await oneEvent(content, 'd2l-dropdown-close');
			expect(content.opened).to.be.false;
		});

		it('clicking inside does not close dropdown', async() => {
			opener.dispatchEvent(new Event('mouseenter'));
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;

			setTimeout(() => dropdown.querySelector('#non_focusable_inside').click());
			await aTimeout(600);
			expect(content.opened).to.be.true;
		});
	});

	describe('click', () => {

		it('opens dropdown when opener clicked', async() => {
			opener.click();
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;
		});

		it('if open closes dropdown when opener clicked', async() => {
			content.toggleOpen();
			await oneEvent(content, 'd2l-dropdown-open');

			setTimeout(() => content.toggleOpen());
			await oneEvent(content, 'd2l-dropdown-close');

			expect(content.opened).to.be.false;
		});

		it('hovering outside does not close dropdown', async() => {
			opener.click();
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;

			setTimeout(() => dropdown.querySelector('#non_focusable_outside').dispatchEvent(new Event('mouseenter')));
			await aTimeout(600);
			expect(content.opened).to.be.true;
		});

		it('clicking outside closes dropdown', async() => {
			opener.click();
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;

			setTimeout(() => dropdown.querySelector('#non_focusable_outside').click());
			await oneEvent(content, 'd2l-dropdown-close');
			expect(content.opened).to.be.false;
		});

		it('clicking inside does not close dropdown', async() => {
			opener.click();
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;

			setTimeout(() => dropdown.querySelector('#non_focusable_inside').click());
			await aTimeout(600);
			expect(content.opened).to.be.true;
		});
	});

	describe('auto-close', () => {

		it('should close when focus element outside receives focus', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await nextFrame();
			await triggerFocusFor(dropdown.querySelector('#focusable_outside'));
			await oneEvent(content, 'd2l-dropdown-close');
			expect(content.opened).to.be.false;
		});

		it('should close when element outside is clicked', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');

			setTimeout(() => dropdown.querySelector('#non_focusable_outside').click());
			await oneEvent(content, 'd2l-dropdown-close');

			expect(content.opened).to.be.false;
		});

		it('should close when ESC key is pressed', async() => {

			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await aTimeout(0);

			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keyup', true, true);
			eventObj.keyCode = 27;

			setTimeout(() => document.dispatchEvent(eventObj));
			await oneEvent(content, 'd2l-dropdown-close');

			expect(content.opened).to.be.false;
		});

	});

	describe('aria-expanded', () => {

		it('should set aria-expanded on the opener', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await button.updateComplete;
			expect(opener.getAttribute('aria-expanded')).to.equal('true');

			setTimeout(() => content.removeAttribute('opened'));
			await oneEvent(content, 'd2l-dropdown-close');
			await button.updateComplete;
			expect(opener.getAttribute('aria-expanded')).to.equal('false');
		});
	});

});
