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

		[
			'inside_header',
			'inside',
			'inside_footer'
		].forEach((name) => {
			it(`should not close when element ${name} is clicked`, async() => {

				const dropdown = await fixture(html`
					<d2l-dropdown>
						<d2l-dropdown-content>
							<span slot="header" id="non_focusable_inside_header">header</span>
							<span id="non_focusable_inside">inside</span>
							<span slot="footer" id="non_focusable_inside_footer">footer</span>
						</d2l-dropdown-content>
					</d2l-dropdown>`);
				content = dropdown.querySelector('d2l-dropdown-content');

				content.setAttribute('opened', true);
				await oneEvent(content, 'd2l-dropdown-open');

				dropdown.querySelector(`#non_focusable_${name}`).click();
				await aTimeout(100);
				expect(content.opened).to.be.true;

			});
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

});
