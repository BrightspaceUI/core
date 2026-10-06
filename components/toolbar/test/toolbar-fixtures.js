import '../toolbar.js';
import '../toolbar-button.js';
import '../toolbar-button-toggle.js';
import '../toolbar-dropdown.js';
import '../toolbar-separator.js';
import '../../dropdown/dropdown-content.js';
import '../../icons/icon-custom.js';
import { codeSvg, formatPainterSvg, insertSvg, mathmlEquationSvg, textColorSvg } from '../../icons/editor-icons.js';
import { html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export const icons = [
	{ key: 'tier1:edit' },
	{ key: 'tier1:link' },
	{ key: 'tier1:pic' },
	{ key: 'tier1:mic' },
	{ key: 'tier1:volume' },
	{ key: 'tier1:accessibility' },
	{ key: 'tier1:undo' },
	{ key: 'tier1:redo' },
	{ key: 'tier1:zoom-in' },
	{ key: 'tier1:zoom-out' },
	{ key: 'tier1:fullscreen' },
	{ key: 'tier1:course' },
	{ key: 'tier1:gear' },
	{ template: html`<d2l-icon-custom size="tier1" slot="icon">${unsafeHTML(formatPainterSvg)}</d2l-icon-custom>` },
	{ template: html`<d2l-icon-custom size="tier1" slot="icon">${unsafeHTML(mathmlEquationSvg)}</d2l-icon-custom>` },
	{ template: html`<d2l-icon-custom size="tier1" slot="icon">${unsafeHTML(codeSvg)}</d2l-icon-custom>` },
	{ template: html`<d2l-icon-custom size="tier1" slot="icon">${unsafeHTML(insertSvg)}</d2l-icon-custom>` },
	{ template: html`<d2l-icon-custom size="tier1" slot="icon">${unsafeHTML(textColorSvg)}</d2l-icon-custom>` }
];

export function createDarkContainer({ template } = {}) {
	return html`<div style="background-color: #161718; display: inline-block; line-height: 0; padding: 6px;">${template}</div>`;
}

export function createDropdownContent() {
	return html`
		<d2l-dropdown-content align="start" class="vdiff-include" no-pointer>
			<div>Fancy Content!</div>
		</d2l-dropdown-content>
	`;
}

export function createToolbar({ template = createToolbarItems() } = {}) {
	return html`
		<div style="width: 400px;">
			<d2l-toolbar label="Fancy Toolbar">
				${template}
			</d2l-toolbar>
		</div>
	`;
}

export function createToolbarButton({ disabled = false, icon = icons[15], text = 'Fancy Button', theme } = {}) {
	return html`
		<d2l-toolbar-button ?disabled="${disabled}" icon="${ifDefined(icon.key)}" text="${text}" theme="${ifDefined(theme)}">
			${icon.template}
		</d2l-toolbar-button>
	`;
}

export function createToolbarDropdown({ disabled = false, icon, text = 'Fancy Dropdown', template = createDropdownContent(), theme, valueText } = {}) {
	return html`
		<d2l-toolbar-dropdown ?disabled="${disabled}" icon="${ifDefined(icon?.key)}" text="${text}" theme="${ifDefined(theme)}" value-text="${ifDefined(valueText)}">
			${icon?.template}
			${template}
		</d2l-toolbar-dropdown>
	`;
}

export function createToolbarButtonToggle({ disabled = false, expandable = false, expanded = false, icon = icons[15], pressed = false, text = 'Fancy Button Toggle', theme } = {}) {
	return html`
		<d2l-toolbar-button-toggle ?disabled="${disabled}" ?expandable="${ifDefined(expandable)}" ?expanded="${ifDefined(expanded)}" icon="${ifDefined(icon.key)}" ?pressed="${ifDefined(pressed)}" text="${text}" theme="${ifDefined(theme)}">
			${icon.template}
		</d2l-toolbar-button-toggle>
	`;
}

export function createToolbarItems({ count = 4, separators = false, theme } = {}) {
	const itemTemplates = [];
	for (let i = 0; i < count; i++) {
		itemTemplates.push(createToolbarButton({ icon: icons[i], text: `Fancy ${i + 1}` }));
		if (separators && i < count - 1) {
			itemTemplates.push(createToolbarSeparator({ theme }));
		}
	}
	return itemTemplates;
}

export function createToolbarSeparator({ theme } = {}) {
	return html`
		<d2l-toolbar-separator theme="${ifDefined(theme)}"></d2l-toolbar-separator>
	`;
}

export async function openDropdown(elem) {
	elem.toggleOpen();
	await oneEvent(elem, 'd2l-dropdown-open');
}
