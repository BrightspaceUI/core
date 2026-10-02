import '../toolbar.js';
import { createDarkContainer, createToolbar, createToolbarButton, createToolbarButtonToggle, createToolbarItems } from './toolbar-fixtures.js';
import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';

function runItemTest({ action, allColorModes, name, template }) {
	it(name, async() => {
		const elem = await fixture(template);
		if (action) await action(elem);
		await expect(elem).to.be.golden({ allColorModes });
	});
}

function hoverElemDarkTheme(elem) {
	return hoverElem(elem.querySelector(':first-child'));
}

function focusElemDarkTheme(elem) {
	return focusElem(elem.querySelector(':first-child'));
}

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
		{ name: 'dark-theme-hover', template: createDarkContainer({ template: createToolbarButton({ theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-focus', template: createDarkContainer({ template: createToolbarButton({ theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-disabled', template: createDarkContainer({ template: createToolbarButton({ disabled: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-disabled-hover', template: createDarkContainer({ template: createToolbarButton({ disabled: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-disabled-focus', template: createDarkContainer({ template: createToolbarButton({ disabled: true, theme: 'dark' }) }), action: focusElemDarkTheme }
	].forEach(runItemTest);

});

describe('d2l-toolbar-button-toggle', () => {

	[
		{ name: 'normal', allColorModes: true, template: createToolbarButtonToggle() },
		{ name: 'iconset-icon', template: createToolbarButtonToggle({ icon: { key: 'tier1:mic' }, iconTemplate: undefined }) },
		{ name: 'hover', allColorModes: true, template: createToolbarButtonToggle(), action: hoverElem },
		{ name: 'focus', allColorModes: true, template: createToolbarButtonToggle(), action: focusElem },
		{ name: 'disabled', allColorModes: true, template: createToolbarButton({ disabled: true }) },
		{ name: 'disabled-hover', allColorModes: true, template: createToolbarButtonToggle({ disabled: true }), action: hoverElem },
		{ name: 'disabled-focus', allColorModes: true, template: createToolbarButtonToggle({ disabled: true }), action: focusElem },
		{ name: 'pressed', allColorModes: true, template: createToolbarButtonToggle({ pressed: true }) },
		{ name: 'pressed-hover', allColorModes: true, template: createToolbarButtonToggle({ pressed: true }), action: hoverElem },
		{ name: 'pressed-focus', allColorModes: true, template: createToolbarButtonToggle({ pressed: true }), action: focusElem },
		{ name: 'pressed-disabled', allColorModes: true, template: createToolbarButtonToggle({ disabled: true, pressed: true }) },
		{ name: 'pressed-disabled-hover', allColorModes: true, template: createToolbarButtonToggle({ disabled: true, pressed: true }), action: hoverElem },
		{ name: 'pressed-disabled-focus', allColorModes: true, template: createToolbarButtonToggle({ disabled: true, pressed: true }), action: focusElem },
		{ name: 'expandable', allColorModes: true, template: createToolbarButtonToggle({ expandable: true }) },
		{ name: 'expandable-hover', allColorModes: true, template: createToolbarButtonToggle({ expandable: true }), action: hoverElem },
		{ name: 'expandable-focus', allColorModes: true, template: createToolbarButtonToggle({ expandable: true }), action: focusElem },
		{ name: 'expandable-expanded', allColorModes: true, template: createToolbarButtonToggle({ expandable: true, expanded: true }) },
		{ name: 'expandable-expanded-hover', allColorModes: true, template: createToolbarButtonToggle({ expandable: true, expanded: true }), action: hoverElem },
		{ name: 'expandable-expanded-focus', allColorModes: true, template: createToolbarButtonToggle({ expandable: true, expanded: true }), action: focusElem },
		{ name: 'dark-theme', template: createDarkContainer({ template: createToolbarButtonToggle({ theme: 'dark' }) }) },
		{ name: 'dark-theme-iconset-icon', template: createDarkContainer({ template: createToolbarButtonToggle({ icon: { key: 'tier1:mic' }, theme: 'dark' }) }) },
		{ name: 'dark-theme-hover', template: createDarkContainer({ template: createToolbarButtonToggle({ theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-focus', template: createDarkContainer({ template: createToolbarButtonToggle({ theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-disabled', template: createDarkContainer({ template: createToolbarButtonToggle({ disabled: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-disabled-hover', template: createDarkContainer({ template: createToolbarButtonToggle({ disabled: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-disabled-focus', template: createDarkContainer({ template: createToolbarButtonToggle({ disabled: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-pressed', template: createDarkContainer({ template: createToolbarButtonToggle({ pressed: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-pressed-hover', template: createDarkContainer({ template: createToolbarButtonToggle({ pressed: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-pressed-focus', template: createDarkContainer({ template: createToolbarButtonToggle({ pressed: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-pressed-disabled', template: createDarkContainer({ template: createToolbarButtonToggle({ disabled: true, pressed: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-pressed-disabled-hover', template: createDarkContainer({ template: createToolbarButtonToggle({ disabled: true, pressed: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-pressed-disabled-focus', template: createDarkContainer({ template: createToolbarButtonToggle({ disabled: true, pressed: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-expandable', template: createDarkContainer({ template: createToolbarButtonToggle({ expandable: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-expandable-hover', template: createDarkContainer({ template: createToolbarButtonToggle({ expandable: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-expandable-focus', template: createDarkContainer({ template: createToolbarButtonToggle({ expandable: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-expandable-expanded', template: createDarkContainer({ template: createToolbarButtonToggle({ expandable: true, expanded: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-expandable-expanded-hover', template: createDarkContainer({ template: createToolbarButtonToggle({ expandable: true, expanded: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-expandable-expanded-focus', template: createDarkContainer({ template: createToolbarButtonToggle({ expandable: true, expanded: true, theme: 'dark' }) }), action: focusElemDarkTheme }
	].forEach(runItemTest);

});
