import '../../button/button.js';
import '../dialog-confirm.js';
import { expect, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';

describe('d2l-dialog-confirm', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-dialog-confirm');
		});

	});

	describe('focus management', () => {

		it('should focus on title', async() => {
			const el = await fixture(html`
				<d2l-dialog-confirm opened title-text="Title" text="Are you sure?">
					<d2l-button slot="footer" primary>Yes</d2l-button>
					<d2l-button id="no" slot="footer">No</d2l-button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			const title = el.shadowRoot.querySelector('h2');
			expect(getComposedActiveElement()).to.equal(title);
		});

		it('should focus on content when no title present', async() => {
			const el = await fixture(html`
				<d2l-dialog-confirm opened text="Are you sure?">
					<d2l-button slot="footer" primary>Yes</d2l-button>
					<d2l-button id="no" slot="footer">No</d2l-button>
				</d2l-dialog-confirm>
			`);
			await oneEvent(el, 'd2l-dialog-open');
			const content = el.shadowRoot.querySelector('.d2l-dialog-content');
			expect(getComposedActiveElement()).to.equal(content);
		});

	});

});
