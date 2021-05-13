import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A checkbox for use in selection components such as lists and tables.
 * @fires d2l-selection-change - Dispatched when the checked state changes
 */
class Checkbox extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * State of the checkbox
			 */
			checked: { type: Boolean },
			/**
			 * Disables the checkbox
			 */
			disabled: { type: Boolean },
			/**
			 * Key for the selectable
			 */
			key: { type: String },
			/**
			 * Non-visible label associated with checkbox
			 */
			label: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	get checked() {
		return this._checked;
	}

	set checked(val) {
		const oldVal = this._checked;
		if (oldVal !== val) {
			this._checked = val;
			this.requestUpdate('checked', oldVal);

			// dispatch the event for all checked changes (not just when the user interacts directly with the checkbox)
			this.dispatchEvent(new CustomEvent('d2l-selection-change', {
				bubbles: true,
				composed: true,
				detail: { key: this.key, selected: this._checked }
			}));

		}
	}

	connectedCallback() {
		super.connectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-selection-checkbox-subscribe', {
			bubbles: true,
			composed: true
		}));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-selection-checkbox-unsubscribe', {
			bubbles: true,
			composed: true
		}));
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.key || this.key.length === 0) console.warn('d2l-selection-checkbox component requires a key.');
		if (!this.label || this.label.length === 0) console.warn('d2l-selection-checkbox component requires label text.');
	}

	render() {
		return html`
			<d2l-input-checkbox
				aria-label="${this.label}"
				@change="${this._handleChange}"
				?checked="${this.checked}"
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}">
			</d2l-input-checkbox>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-checkbox');
		if (elem) elem.focus();
	}

	_handleChange(e) {
		e.stopPropagation();
		this.checked = e.target.checked;
	}

}

customElements.define('d2l-selection-checkbox', Checkbox);
