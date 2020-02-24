import '../dropdown.js';
import '../dropdown-content.js';
import { aTimeout, expect, fixture, html, nextFrame, oneEvent, triggerFocusFor } from '@open-wc/testing';

const normalFixture = html`
	<div>
		<div id="optionallyFocusable">
			<d2l-dropdown>
				<button class="another-class d2l-dropdown-opener"></button>
				<d2l-dropdown-content>
					<p id="non_focusable_inside">a</p>
					<a id="focusable_inside" href="http://www.desire2learn.com">b</a>
				</d2l-dropdown-content>
			</d2l-dropdown>
			<p id="non_focusable_outside">c</p>
			<button id="focusable_outside">out here</button>
		</div>
	</div>
`;

describe('d2l-dropdown', () => {

	let dropdown, content;

	beforeEach(async() => {
		dropdown = await fixture(normalFixture);
		content = dropdown.querySelector('d2l-dropdown-content');
	});

	describe('opener', () => {

		it('gets opener when the opener has multiple classes', () => {
			const dropdownContainer = dropdown.querySelector('d2l-dropdown');
			const actualOpener = dropdownContainer.getOpenerElement();
			const expectedOpener = dropdown.querySelector('.d2l-dropdown-opener');
			expect(actualOpener).to.equal(expectedOpener);
		});

	});

	describe('events', () => {

		it('fires open event when open attribute is added', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			expect(content.opened).to.be.true;
		});

		it('fires close event when open attribute is removed', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');

			setTimeout(() => content.removeAttribute('opened'));
			await oneEvent(content, 'd2l-dropdown-close');

			expect(content.opened).to.be.false;
		});

		it('doesnt fire open event when already opened', async() => {
			content.opened = true;
			await oneEvent(content, 'd2l-dropdown-open');
			let hasDuplicateEvent = false;
			oneEvent(content, 'd2l-dropdown-open').then(() => hasDuplicateEvent = true);
			content.opened = true;
			await aTimeout(100);
			expect(hasDuplicateEvent).to.be.false;
		});

		it('doesnt fire close event when already closed', async() => {
			let hasDuplicateEvent = false;
			oneEvent(content, 'd2l-dropdown-close').then(() => hasDuplicateEvent = true);
			content.opened = false;
			await aTimeout(100);
			expect(hasDuplicateEvent).to.be.false;
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

	describe('scrollTo', () => {
		it('sets scrollTop to specified value', async() => {

			content.boundary = {
				below: 11,
				above: 11
			};
			content.opened = true;

			await oneEvent(content, 'd2l-dropdown-position');

			expect(content.__content.scrollTop).to.equal(0);
			content.scrollTo(1);
			// Rounded because on systems using display scaling, scrollTop may give you a decimal value.
			expect(Math.round(content.__content.scrollTop)).to.equal(1);
		});
	});

	describe('auto-focus', () => {

		it('focuses on descendant when opened', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await nextFrame();
			expect(document.activeElement).to.equal(content.querySelector('#focusable_inside'));
		});

		it('does not focus on descendant when opened and no-auto-focus attribute is specified', async() => {
			const activeElement = document.activeElement;
			content.setAttribute('no-auto-focus', true);
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await nextFrame();
			expect(document.activeElement).to.equal(activeElement);
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

		it('should not close when element outside receives focus and no-auto-close is set', async() => {
			content.setAttribute('no-auto-close', true);
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await nextFrame();

			await triggerFocusFor(dropdown.querySelector('#focusable_outside'));
			await aTimeout(100);
			expect(content.opened).to.be.true;
		});

		it('should not close when element inside receives focus', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await nextFrame();

			await triggerFocusFor(content.querySelector('#focusable_inside'));
			await aTimeout(100);
			expect(content.opened).to.be.true;
		});

		it('should not close when activeElement becomes body', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await nextFrame();

			// this simulates a click on an element inside the dropdown,
			// which causes focus to be lost and activeElement to become
			// document.body
			document.body.setAttribute('tabindex', '-1');
			await triggerFocusFor(document.body);
			await aTimeout(100);
			expect(content.opened).to.be.true;
		});

		it('should not close when activeElement becomes focusable ancestor', async() => {
			const focusableAncestor = dropdown.querySelector('#optionallyFocusable');
			focusableAncestor.setAttribute('tabindex', '-1');

			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await nextFrame();

			// this simulates a click on an element inside the dropdown,
			// which causes focus to be lost and activeElement to become
			// the focusable ancestor of the dropdown
			await triggerFocusFor(focusableAncestor);
			await aTimeout(100);
			expect(content.opened).to.be.true;
		});

		it('should not close when element inside is clicked', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');

			dropdown.querySelector('#non_focusable_inside').click();
			await aTimeout(100);
			expect(content.opened).to.be.true;
		});

		it('should not close when element outside is clicked and no-auto-close is set', async() => {
			content.setAttribute('no-auto-close', true);
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');

			dropdown.querySelector('#non_focusable_outside').click();
			await aTimeout(100);
			expect(content.opened).to.be.true;
		});

		it('should focus on container when opened and no focusable light descendant exists', async() => {
			content.querySelector('#focusable_inside').setAttribute('tabindex', '-1');
			content.setAttribute('opened', true);

			await oneEvent(content, 'd2l-dropdown-open');
			const contentContainer = content.__getContentContainer();
			expect(contentContainer.getAttribute('tabindex')).to.equal('-1');
			if (content.shadowRoot) {
				expect(document.activeElement).to.equal(content);
				expect(content.shadowRoot.activeElement).to.equal(contentContainer);
			} else {
				expect(document.activeElement).to.equal(contentContainer);
			}
		});

	});

	describe('aria-expanded', () => {

		let opener;

		beforeEach(async() => {
			opener = dropdown.querySelector('.d2l-dropdown-opener');
		});

		it('should set aria-expanded on the opener', async() => {
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');
			await opener.updateComplete;
			expect(opener.getAttribute('aria-expanded')).to.equal('true');

			setTimeout(() => content.removeAttribute('opened'));
			await oneEvent(content, 'd2l-dropdown-close');
			await opener.updateComplete;
			expect(opener.getAttribute('aria-expanded')).to.equal('false');
		});
	});

	describe('vertical-offset', () => {

		it('vertical offset should update if set without px', async() => {
			content.setAttribute('vertical-offset', 100);
			await nextFrame();
			expect(content.style.getPropertyValue('--d2l-dropdown-verticaloffset')).to.equal('100px');
		});

		it('vertical offset should update if set with px', async() => {
			content.setAttribute('vertical-offset', '50px');
			await nextFrame();
			expect(content.style.getPropertyValue('--d2l-dropdown-verticaloffset')).to.equal('50px');
		});

		it('vertical offset should default to 20 if removed', async() => {
			content.setAttribute('vertical-offset', 100);
			await nextFrame();
			content.removeAttribute('vertical-offset');
			await nextFrame();
			expect(content.style.getPropertyValue('--d2l-dropdown-verticaloffset')).to.equal('20px');
		});

		it('vertical offset should default to 20 if set to an invalid number', async() => {
			content.setAttribute('vertical-offset', 'thisisnotasize');
			await nextFrame();
			expect(content.style.getPropertyValue('--d2l-dropdown-verticaloffset')).to.equal('20px');
		});

	});

});
