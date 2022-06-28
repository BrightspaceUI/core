import '../empty-state-text.js';
import '../../button/button-subtle.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-empty-state-text',  () => {
	it('should construct', () => {
		runConstructor('d2l-empty-state-text');
	});

	it('should render a span with the given description', async() => {
		const description = 'There are currently no courses.';
		const el = await fixture(html`<d2l-empty-state-text description=${description}></d2l-empty-state-text>`);
		expect(el.shadowRoot.querySelector('span').innerText).to.be.equal(description);
	});

	it('should render a subtle button with the action-text', async() => {
		const actionText = 'Create a Course';
		const el = await fixture(html`<d2l-empty-state-text action-text=${actionText}></d2l-empty-state-text>`);
		expect(el.shadowRoot.querySelector('d2l-button-subtle')).to.exist;
		expect(el.shadowRoot.querySelector('d2l-button-subtle').text).to.be.equal(actionText);
	});

	it('should not render a subtle button if no action-text is given', async() => {
		const el = await fixture(html`<d2l-empty-state-text description='There are currently no courses.'></d2l-empty-state-text>`);
		expect(el.shadowRoot.querySelector('d2l-button-subtle')).to.not.exist;
	});

	it('should render a subtle button from slot if no action-text is given', async() => {
		const actionText = 'Create a Course';
		const el = await fixture(html`
			<d2l-empty-state-text description='There are currently no courses.'>
				<d2l-button-subtle text=${actionText}></d2l-button-subtle>
			</d2l-empty-state-text>
		`);
		expect(el.querySelector('d2l-button-subtle')).to.exist;
		expect(el.querySelector('d2l-button-subtle').text).to.be.equal(actionText);

	});

	it('should not render components in slot if action-text is given', async() => {
		const actionText = 'Create a Course';
		const el = await fixture(html`
			<d2l-empty-state-text description='There are currently no courses.' action-text=${actionText}>
				<d2l-link  href="https://www.d2l.com/">Should Not Exist</d2l-link>
			</d2l-empty-state-text>
		`);
		expect(el.shadowRoot.querySelector('d2l-link')).to.not.exist;
		expect(el.shadowRoot.querySelector('d2l-button-subtle')).to.exist;
		expect(el.shadowRoot.querySelector('d2l-button-subtle').text).to.be.equal(actionText);
	});

	it('dispatches d2l-empty-state-action when action is clicked', async() => {
		const el = await fixture(html`<d2l-empty-state-text action-text='Create a Course'></d2l-empty-state-text>`);
		setTimeout(() => el.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(el, 'd2l-empty-state-action');
	});
});
