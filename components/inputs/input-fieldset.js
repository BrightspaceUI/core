import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help.js';
import { inputLabelStyles } from './input-label-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A component wrapper to be used when a page contains multiple inputs which are related (for example to form an address) to wrap those related inputs.
 * @slot - Related input components
 */
class InputFieldset extends InputInlineHelpMixin(SkeletonMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Label for the fieldset
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * Hides the label visually
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Indicates that a value is required for inputs in the fieldset
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ super.styles, inputLabelStyles, offscreenStyles,
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();
		this.labelHidden = false;
		this.required = false;
		this._inlineHelpId = getUniqueId();
	}

	render() {
		const legendClasses = {
			'd2l-input-label': true,
			'd2l-offscreen': this.labelHidden,
			'd2l-skeletize': true
		};
		return html`
			<fieldset
				class="d2l-input-label-fieldset"
				aria-describedby="${ifDefined(this._hasInlineHelp ? this._inlineHelpId : undefined)}"
			>
				<legend class="${classMap(legendClasses)}">${this.label}</legend>
				<slot></slot>
				${this._renderInlineHelp(this._inlineHelpId)}
			</fieldset>
		`;
	}

}
customElements.define('d2l-input-fieldset', InputFieldset);
