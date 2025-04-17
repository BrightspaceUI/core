import '../input-checkbox.js';
import { html } from 'lit';

export const checkboxFixtures = {
	/* label variants */
	labelAria: html`<d2l-input-checkbox aria-label="label aria"></d2l-input-checkbox>`,
	labelNormal: html`<d2l-input-checkbox label="label normal"></d2l-input-checkbox>`,
	labelHidden: html`<d2l-input-checkbox label="label hidden" label-hidden></d2l-input-checkbox>`,
	labelSlotted: html`<d2l-input-checkbox>label slotted</d2l-input-checkbox>`,
	labelMultiline: html`<d2l-input-checkbox style="overflow: hidden; width: 200px;" label="Label for checkbox that wraps nicely onto multiple lines and stays aligned"></d2l-input-checkbox>`,
	labelMultilineUnbreakable: html`<d2l-input-checkbox style="overflow: hidden; width: 200px;" label="https://en.wikipedia.org/wiki/Dark_matter"></d2l-input-checkbox>`,
	/* checkbox variants */
	checked: html`<d2l-input-checkbox label="label" checked></d2l-input-checkbox>`,
	unchecked: html`<d2l-input-checkbox label="label"></d2l-input-checkbox>`,
	indeterminateChecked: html`<d2l-input-checkbox label="label" indeterminate checked></d2l-input-checkbox>`,
	indeterminateUnchecked: html`<d2l-input-checkbox label="label" indeterminate></d2l-input-checkbox>`,
	/* disabled variants */
	disabled: html`<d2l-input-checkbox label="label" disabled></d2l-input-checkbox>`,
	disabledTooltip: html`<d2l-input-checkbox label="label" disabled disabled-tooltip="Tooltip text"></d2l-input-checkbox>`,
	/* supporting slot */
	supporting: html`
		<d2l-input-checkbox label="Label for checkbox">
			<div slot="supporting" style="color: #999999;">
				Additional content can go here and will<br>
				also line up nicely with the checkbox.
			</div>
		</d2l-input-checkbox>
	`,

};
