import '../dialog-fullscreen.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import { aTimeout, clickElem, expect, fixture, html, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-dialog-fullscreen', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-dialog-fullscreen');
		});

	});

	describe('properties', () => {

		it('throws error when no title-text', async() => {
			const el = await fixture(html`<d2l-dialog-fullscreen></d2l-dialog-fullscreen>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'title-text'));
		});

	});

	describe('behavior', () => {

		it('should not close a dropdown when it is within a dialog where the content is displayed late', async() => {
			const el = await fixture(html`
					<d2l-dialog-fullscreen opened>
						<d2l-dropdown style="display: none;">
							<button class="d2l-dropdown-opener">Open!</button>
							<d2l-dropdown-content>
								<a href=" " style="display: block;">A Link</a>
								<div>Some content... Click me!</div>
							</d2l-dropdown-content>
						</d2l-dropdown>
					</d2l-dialog-fullscreen>
			`);
			await aTimeout(100);
			const dropdown = el.querySelector('d2l-dropdown');
			dropdown.style.display = 'block';

			const content = el.querySelector('d2l-dropdown-content');
			content.setAttribute('opened', true);
			await oneEvent(content, 'd2l-dropdown-open');

			let dispatched = false;
			content.addEventListener('d2l-dropdown-close', () => dispatched = true);

			const div = content.querySelector('div');
			clickElem(div);
			await aTimeout(100);
			expect(dispatched).to.be.false;
		});

		it('sets focusableContentElemPresent to true when there is a focusable element in the dialog added late', async() => {
			const el = await fixture(html`
				<div>
					<d2l-dialog-fullscreen opened>
					</d2l-dialog-fullscreen>
					<d2l-dropdown>
						<button class="d2l-dropdown-opener">Open!</button>
						<d2l-dropdown-content>
							<a href=" " style="display: block;">A Link</a>
							<div>Some content... Click me!</div>
						</d2l-dropdown-content>
					</d2l-dropdown>
				</div>
			`);

			const dialog = el.querySelector('d2l-dialog-fullscreen');
			expect(dialog.focusableContentElemPresent).to.be.false;
			await aTimeout(300);
			dialog.appendChild(el.querySelector('d2l-dropdown'));
			await waitUntil(() => dialog.focusableContentElemPresent, 'focusableContentElemPresent never became true');
		});
	});

});
