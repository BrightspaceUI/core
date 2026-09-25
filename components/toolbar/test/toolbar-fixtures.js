import '../toolbar.js';
import '../toolbar-button.js';
import '../../icons/icon-custom.js';
import { codeSvg, formatPainterSvg, mathmlEquationSvg } from '../../icons/editor-icons.js';
import { html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const icons = [
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
	{ template: html`<d2l-icon-custom size="tier1" slot="icon">${unsafeHTML(codeSvg)}</d2l-icon-custom>` }
];

export function createDarkContainer({ template } = {}) {
	return html`<div style="background-color: #161718; display: inline-block; padding: 6px;">${template}</div>`;
}

export function createToolbar({ itemsTemplate = createToolbarItems() } = {}) {
	return html`
		<div style="width: 400px;">
			<d2l-toolbar label="Fancy Toolbar">
				${itemsTemplate}
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

export function createToolbarItems({ count = 4 } = {}) {
	const itemTemplates = [];
	for (let i = 0; i < count; i++) {
		itemTemplates.push(createToolbarButton({ icon: icons[i], text: `Fancy ${i + 1}` }));
	}
	return itemTemplates;
}

