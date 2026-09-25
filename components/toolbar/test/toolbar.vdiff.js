import '../toolbar.js';
import { createDarkContainer, createToolbar, createToolbarButton, createToolbarItems } from './toolbar-fixtures.js';
import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';

describe('d2l-toolbar', () => {

	[
		{ name: 'normal', allColorModes: true, template: createToolbar() },
		{ name: 'wrapping', template: createToolbar({ itemsTemplate: createToolbarItems({ count: 16 }) }) },
		{ name: 'rtl', rtl: true, template: createToolbar() }
	].forEach(({ action, allColorModes, name, rtl, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			if (action) await action(elem);
			await expect(elem).to.be.golden({ allColorModes });
		});
	});

});

describe('d2l-toolbar-button', () => {

	[
		{ name: 'normal', allColorModes: true, template: createToolbarButton() },
		{ name: 'iconset-icon', template: createToolbarButton({ icon: { key: 'tier1:mic' }, iconTemplate: undefined }) },
		{ name: 'hover', allColorModes: true, template: createToolbarButton(), action: hoverElem },
		{ name: 'focus', allColorModes: true, template: createToolbarButton(), action: focusElem },
		{ name: 'disabled', allColorModes: true, template: createToolbarButton({ disabled: true }) },
		{ name: 'disabled-hover', allColorModes: true, template: createToolbarButton({ disabled: true }), action: hoverElem },
		{ name: 'disabled-focus', allColorModes: true, template: createToolbarButton({ disabled: true }), action: focusElem },
		{ name: 'dark-theme', template: createDarkContainer({ template: createToolbarButton({ theme: 'dark' }) }) },
		{ name: 'dark-theme-iconset-icon', template: createDarkContainer({ template: createToolbarButton({ icon: { key: 'tier1:mic' }, theme: 'dark' }) }) },
		{ name: 'dark-theme-hover', template: createDarkContainer({ template: createToolbarButton({ theme: 'dark' }) }), action: hoverElem },
		{ name: 'dark-theme-focus', template: createDarkContainer({ template: createToolbarButton({ theme: 'dark' }) }), action: focusElem },
		{ name: 'dark-theme-disabled', template: createDarkContainer({ template: createToolbarButton({ disabled: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-disabled-hover', template: createDarkContainer({ template: createToolbarButton({ disabled: true, theme: 'dark' }) }), action: hoverElem },
		{ name: 'dark-theme-disabled-focus', template: createDarkContainer({ template: createToolbarButton({ disabled: true, theme: 'dark' }) }), action: focusElem }
	].forEach(({ action, allColorModes, name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			if (action) await action(elem);
			await expect(elem).to.be.golden({ allColorModes });
		});
	});

});
