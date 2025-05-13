import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading4Styles } from '../typography/styles.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help.js';
import { inputLabelStyles } from './input-label-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A component wrapper to be used when a page contains multiple inputs which are related (for example to form an address) to wrap those related inputs.
 * @slot - Related input components
 */
class InputFieldset extends PropertyRequiredMixin(InputInlineHelpMixin(SkeletonMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Label for the fieldset
			 * @type {string}
			 */
			label: { type: String, required: true },
			/**
			 * Hides the label visually
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Style of the fieldset label
			 * @type {'default'|'heading'}
			 */
			labelStyle: { type: String, attribute: 'label-style', reflect: true },
			/**
			 * Indicates that a value is required for inputs in the fieldset
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ super.styles, heading4Styles, inputLabelStyles, offscreenStyles,
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
				legend.d2l-heading-4 {
					margin-block-start: 0;
				}
			`
		];
	}

	constructor() {
		super();
		this.labelHidden = false;
		this.labelStyle = 'default';
		this.required = false;
		this._inlineHelpId = getUniqueId();
	}

	render() {
		const legendClasses = {
			'd2l-heading-4': this.labelStyle === 'heading',
			'd2l-input-label': this.labelStyle === 'default',
			'd2l-offscreen': this.labelHidden,
			'd2l-skeletize': true
		};
		return html`
			<fieldset
				class="d2l-input-label-fieldset"
				aria-describedby="${ifDefined(this._hasInlineHelp ? this._inlineHelpId : undefined)}">
				<legend class="${classMap(legendClasses)}">${this.label}</legend>
				<slot></slot>
				${this._renderInlineHelp(this._inlineHelpId)}
			</fieldset>
		`;
	}

}
customElements.define('d2l-input-fieldset', InputFieldset);
