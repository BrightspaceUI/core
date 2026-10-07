import '../toolbar.js';
import {
	createDarkContainer,
	createToolbar,
	createToolbarButton,
	createToolbarDropdown,
	createToolbarItems,
	createToolbarSeparator,
	createToolbarToggle,
	icons,
	openDropdown
} from './toolbar-fixtures.js';
import { expect, fixture, focusElem, hoverElem, oneEvent } from '@brightspace-ui/testing';

function runItemTest({ action, allColorModes, name, template }) {
	it(name, async() => {
		const elem = await fixture(template);
		if (action) await action(elem);
		await expect(elem).to.be.golden({ allColorModes });
	});
}

async function focusToolbarItem(elem) {
	focusElem(elem);
	await oneEvent(elem, 'd2l-tooltip-show');
}

async function hoverToolbarItem(elem) {
	hoverElem(elem);
	await oneEvent(elem, 'd2l-tooltip-show');
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
		{ name: 'wrapping', template: createToolbar({ template: createToolbarItems({ count: 16 }) }) },
		{ name: 'rtl', rtl: true, template: createToolbar() },
		{ name: 'separators', template: createToolbar({ template: createToolbarItems({ separators: true }) }) }
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
		{ name: 'iconset-icon', template: createToolbarButton({ icon: { key: 'tier1:mic' } }) },
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

describe('d2l-toolbar-toggle', () => {

	[
		{ name: 'normal', allColorModes: true, template: createToolbarToggle() },
		{ name: 'iconset-icon', template: createToolbarToggle({ icon: { key: 'tier1:mic' } }) },
		{ name: 'hover', allColorModes: true, template: createToolbarToggle(), action: hoverElem },
		{ name: 'focus', allColorModes: true, template: createToolbarToggle(), action: focusElem },
		{ name: 'disabled', allColorModes: true, template: createToolbarToggle({ disabled: true }) },
		{ name: 'disabled-hover', allColorModes: true, template: createToolbarToggle({ disabled: true }), action: hoverElem },
		{ name: 'disabled-focus', allColorModes: true, template: createToolbarToggle({ disabled: true }), action: focusElem },
		{ name: 'pressed', allColorModes: true, template: createToolbarToggle({ pressed: true }) },
		{ name: 'pressed-hover', allColorModes: true, template: createToolbarToggle({ pressed: true }), action: hoverElem },
		{ name: 'pressed-focus', allColorModes: true, template: createToolbarToggle({ pressed: true }), action: focusElem },
		{ name: 'pressed-disabled', allColorModes: true, template: createToolbarToggle({ disabled: true, pressed: true }) },
		{ name: 'pressed-disabled-hover', allColorModes: true, template: createToolbarToggle({ disabled: true, pressed: true }), action: hoverElem },
		{ name: 'pressed-disabled-focus', allColorModes: true, template: createToolbarToggle({ disabled: true, pressed: true }), action: focusElem },
		{ name: 'expandable', allColorModes: true, template: createToolbarToggle({ expandable: true }) },
		{ name: 'expandable-hover', allColorModes: true, template: createToolbarToggle({ expandable: true }), action: hoverElem },
		{ name: 'expandable-focus', allColorModes: true, template: createToolbarToggle({ expandable: true }), action: focusElem },
		{ name: 'expandable-expanded', allColorModes: true, template: createToolbarToggle({ expandable: true, expanded: true }) },
		{ name: 'expandable-expanded-hover', allColorModes: true, template: createToolbarToggle({ expandable: true, expanded: true }), action: hoverElem },
		{ name: 'expandable-expanded-focus', allColorModes: true, template: createToolbarToggle({ expandable: true, expanded: true }), action: focusElem },
		{ name: 'dark-theme', template: createDarkContainer({ template: createToolbarToggle({ theme: 'dark' }) }) },
		{ name: 'dark-theme-iconset-icon', template: createDarkContainer({ template: createToolbarToggle({ icon: { key: 'tier1:mic' }, theme: 'dark' }) }) },
		{ name: 'dark-theme-hover', template: createDarkContainer({ template: createToolbarToggle({ theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-focus', template: createDarkContainer({ template: createToolbarToggle({ theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-disabled', template: createDarkContainer({ template: createToolbarToggle({ disabled: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-disabled-hover', template: createDarkContainer({ template: createToolbarToggle({ disabled: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-disabled-focus', template: createDarkContainer({ template: createToolbarToggle({ disabled: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-pressed', template: createDarkContainer({ template: createToolbarToggle({ pressed: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-pressed-hover', template: createDarkContainer({ template: createToolbarToggle({ pressed: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-pressed-focus', template: createDarkContainer({ template: createToolbarToggle({ pressed: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-pressed-disabled', template: createDarkContainer({ template: createToolbarToggle({ disabled: true, pressed: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-pressed-disabled-hover', template: createDarkContainer({ template: createToolbarToggle({ disabled: true, pressed: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-pressed-disabled-focus', template: createDarkContainer({ template: createToolbarToggle({ disabled: true, pressed: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-expandable', template: createDarkContainer({ template: createToolbarToggle({ expandable: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-expandable-hover', template: createDarkContainer({ template: createToolbarToggle({ expandable: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-expandable-focus', template: createDarkContainer({ template: createToolbarToggle({ expandable: true, theme: 'dark' }) }), action: focusElemDarkTheme },
		{ name: 'dark-theme-expandable-expanded', template: createDarkContainer({ template: createToolbarToggle({ expandable: true, expanded: true, theme: 'dark' }) }) },
		{ name: 'dark-theme-expandable-expanded-hover', template: createDarkContainer({ template: createToolbarToggle({ expandable: true, expanded: true, theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-expandable-expanded-focus', template: createDarkContainer({ template: createToolbarToggle({ expandable: true, expanded: true, theme: 'dark' }) }), action: focusElemDarkTheme }
	].forEach(runItemTest);

});

describe('d2l-toolbar-dropdown', () => {

	[
		{ name: 'icon', allColorModes: true, template: createToolbarDropdown({ icon: icons[16] }) },
		{ name: 'iconset-icon', template: createToolbarDropdown({ icon: { key: 'tier1:mic' } }) },
		{ name: 'icon-hover', allColorModes: true, template: createToolbarDropdown({ icon: icons[16] }), action: hoverToolbarItem },
		{ name: 'icon-focus', allColorModes: true, template: createToolbarDropdown({ icon: icons[16] }), action: focusToolbarItem },
		{ name: 'value-text', allColorModes: true, template: createToolbarDropdown({ valueText: 'Amethyst' }) },
		{ name: 'value-text-hover', allColorModes: true, template: createToolbarDropdown({ valueText: 'Amethyst' }), action: hoverToolbarItem },
		{ name: 'value-text-focus', allColorModes: true, template: createToolbarDropdown({ valueText: 'Amethyst' }), action: focusToolbarItem },
		{ name: 'icon-value-text', allColorModes: true, template: createToolbarDropdown({ icon: icons[17], valueText: 'Amethyst' }) },
		{ name: 'icon-value-text-hover', allColorModes: true, template: createToolbarDropdown({ icon: icons[17], valueText: 'Amethyst' }), action: hoverToolbarItem },
		{ name: 'icon-value-text-focus', allColorModes: true, template: createToolbarDropdown({ icon: icons[17], valueText: 'Amethyst' }), action: focusToolbarItem },
		{ name: 'icon-value-text-disabled', allColorModes: true, template: createToolbarDropdown({ disabled: true, icon: icons[17], valueText: 'Amethyst' }) },
		{ name: 'icon-value-text-disabled-hover', allColorModes: true, template: createToolbarDropdown({ disabled: true, icon: icons[17], valueText: 'Amethyst' }), action: hoverToolbarItem },
		{ name: 'icon-value-text-disabled-focus', allColorModes: true, template: createToolbarDropdown({ disabled: true, icon: icons[17], valueText: 'Amethyst' }), action: focusToolbarItem },
		{ name: 'open', template: createToolbarDropdown({ icon: icons[16] }), action: openDropdown },
		{ name: 'dark-theme-icon-value-text', template: createDarkContainer({ template: createToolbarDropdown({ icon: icons[17], valueText: 'Amethyst', theme: 'dark' }) }) },
		{ name: 'dark-theme-icon-value-text-hover', template: createDarkContainer({ template: createToolbarDropdown({ icon: icons[17], valueText: 'Amethyst', theme: 'dark' }) }), action: hoverElemDarkTheme },
		{ name: 'dark-theme-icon-value-text-focus', template: createDarkContainer({ template: createToolbarDropdown({ icon: icons[17], valueText: 'Amethyst', theme: 'dark' }) }), action: focusElemDarkTheme }
	].forEach(runItemTest);

});

describe('d2l-toolbar-separator', () => {

	[
		{ name: 'normal', allColorModes: true, template: createToolbarSeparator() },
		{ name: 'dark-theme', template: createDarkContainer({ template: createToolbarSeparator({ theme: 'dark' }) }) }
	].forEach(runItemTest);

});
