import { createToolbar, createToolbarButton } from './toolbar-fixtures.js';
import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';

describe('d2l-toolbar', () => {

	it('normal', async() => {
		const el = await fixture(createToolbar());
		await expect(el).to.be.accessible();
	});

});

describe('d2l-toolbar-button', () => {

	[
		{ name: 'normal', template: createToolbarButton() },
		{ name: 'disabled', template: createToolbarButton({ disabled: true }) },
		{ name: 'hover', template: createToolbarButton(), action: hoverElem },
		{ name: 'focus', template: createToolbarButton(), action: focusElem }
	].forEach(({ action, name, template }) => {
		it(name, async() => {
			const el = await fixture(template);
			if (action) await action(el);
			await expect(el).to.be.accessible();
		});
	});

});
