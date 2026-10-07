import {
	createToolbar,
	createToolbarButton,
	createToolbarDropdown,
	createToolbarToggle,
	icons
} from './toolbar-fixtures.js';
import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';

describe('d2l-toolbar', () => {

	it('normal', async() => {
		const elem = await fixture(createToolbar());
		await expect(elem).to.be.accessible();
	});

});

function runItemTest({ action, name, template }) {
	it(name, async() => {
		const elem = await fixture(template);
		if (action) await action(elem);
		await expect(elem).to.be.accessible();
	});
}

describe('d2l-toolbar-button', () => {

	[
		{ name: 'normal', template: createToolbarButton() },
		{ name: 'hover', template: createToolbarButton(), action: hoverElem },
		{ name: 'focus', template: createToolbarButton(), action: focusElem },
		{ name: 'disabled', template: createToolbarButton({ disabled: true }) },
		{ name: 'disabled-hover', template: createToolbarButton({ disabled: true }), action: hoverElem },
		{ name: 'disabled-focus', template: createToolbarButton({ disabled: true }), action: focusElem }
	].forEach(runItemTest);

});

describe('d2l-toolbar-toggle', () => {

	[
		{ name: 'normal', template: createToolbarToggle() },
		{ name: 'hover', template: createToolbarToggle(), action: hoverElem },
		{ name: 'focus', template: createToolbarToggle(), action: focusElem },
		{ name: 'disabled', template: createToolbarToggle({ disabled: true }) },
		{ name: 'disabled-hover', template: createToolbarToggle({ disabled: true }), action: hoverElem },
		{ name: 'disabled-focus', template: createToolbarToggle({ disabled: true }), action: focusElem },
		{ name: 'pressed', template: createToolbarToggle({ pressed: true }) },
		{ name: 'pressed-hover', template: createToolbarToggle({ pressed: true }), action: hoverElem },
		{ name: 'pressed-focus', template: createToolbarToggle({ pressed: true }), action: focusElem },
		{ name: 'pressed-disabled', template: createToolbarToggle({ disabled: true, pressed: true }) },
		{ name: 'pressed-disabled-hover', template: createToolbarToggle({ disabled: true, pressed: true }), action: hoverElem },
		{ name: 'pressed-disabled-focus', template: createToolbarToggle({ disabled: true, pressed: true }), action: focusElem },
		{ name: 'expandable', template: createToolbarToggle({ expandable: true }) },
		{ name: 'expandable-hover', template: createToolbarToggle({ expandable: true }), action: hoverElem },
		{ name: 'expandable-focus', template: createToolbarToggle({ expandable: true }), action: focusElem },
		{ name: 'expandable-disabled', template: createToolbarToggle({ disabled: true, expandable: true }) },
		{ name: 'expandable-disabled-hover', template: createToolbarToggle({ disabled: true, expandable: true }), action: hoverElem },
		{ name: 'expandable-disabled-focus', template: createToolbarToggle({ disabled: true, expandable: true }), action: focusElem },
		{ name: 'expandable-expanded', template: createToolbarToggle({ expandable: true, expanded: true }) },
		{ name: 'expandable-expanded-hover', template: createToolbarToggle({ expandable: true, expanded: true }), action: hoverElem },
		{ name: 'expandable-expanded-focus', template: createToolbarToggle({ expandable: true, expanded: true }), action: focusElem },
		{ name: 'expandable-expanded-disabled', template: createToolbarToggle({ disabled: true, expandable: true, expanded: true }) },
		{ name: 'expandable-expanded-disabled-hover', template: createToolbarToggle({ disabled: true, expandable: true, expanded: true }), action: hoverElem },
		{ name: 'expandable-expanded-disabled-focus', template: createToolbarToggle({ disabled: true, expandable: true, expanded: true }), action: focusElem }
	].forEach(runItemTest);

});

describe('d2l-toolbar-dropdown', () => {

	[
		{ name: 'icon', template: createToolbarDropdown({ icon: icons[16] }) },
		{ name: 'icon-hover', template: createToolbarDropdown({ icon: icons[16] }), action: hoverElem },
		{ name: 'icon-focus', template: createToolbarDropdown({ icon: icons[16] }), action: focusElem },
		{ name: 'value-text', template: createToolbarDropdown({ valueText: 'Value Text' }) },
		{ name: 'value-text-hover', template: createToolbarDropdown({ valueText: 'Value Text' }), action: hoverElem },
		{ name: 'value-text-focus', template: createToolbarDropdown({ valueText: 'Value Text' }), action: focusElem },
		{ name: 'icon-value-text', template: createToolbarDropdown({ icon: icons[16], valueText: 'Value Text' }) },
		{ name: 'icon-value-text-hover', template: createToolbarDropdown({ icon: icons[16], valueText: 'Value Text' }), action: hoverElem },
		{ name: 'icon-value-text-focus', template: createToolbarDropdown({ icon: icons[16], valueText: 'Value Text' }), action: focusElem },
		{ name: 'icon-disabled', template: createToolbarDropdown({ disabled: true, icon: icons[16] }) },
		{ name: 'icon-disabled-hover', template: createToolbarDropdown({ disabled: true, icon: icons[16] }), action: hoverElem },
		{ name: 'icon-disabled-focus', template: createToolbarDropdown({ disabled: true, icon: icons[16] }), action: focusElem },
		{ name: 'value-text-disabled', template: createToolbarDropdown({ disabled: true, valueText: 'Value Text' }) },
		{ name: 'value-text-disabled-hover', template: createToolbarDropdown({ disabled: true, valueText: 'Value Text' }), action: hoverElem },
		{ name: 'value-text-disabled-focus', template: createToolbarDropdown({ disabled: true, valueText: 'Value Text' }), action: focusElem },
		{ name: 'icon-value-text-disabled', template: createToolbarDropdown({ disabled: true, icon: icons[16], valueText: 'Value Text' }) },
		{ name: 'icon-value-text-disabled-hover', template: createToolbarDropdown({ disabled: true, icon: icons[16], valueText: 'Value Text' }), action: hoverElem },
		{ name: 'icon-value-text-disabled-focus', template: createToolbarDropdown({ disabled: true, icon: icons[16], valueText: 'Value Text' }), action: focusElem }
	].forEach(runItemTest);

});
