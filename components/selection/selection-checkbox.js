import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A checkbox for use in selection components such as lists and tables.
 * @fires d2l-selection-change - Dispatched when the selected state changes
 */
class Checkbox extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * State of the checkbox
			 */
			selected: { type: Boolean },
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

	constructor() {
		super();
		this._provider = null;
	}

	get selected() {
		return this._selected;
	}

	set selected(val) {
		const oldVal = this._selected;
		if (oldVal !== val) {
			this._selected = val;
			this.requestUpdate('selected', oldVal);

			// dispatch the event for all selected changes (not just when the user interacts directly with the checkbox)
			this.dispatchEvent(new CustomEvent('d2l-selection-change', {
				bubbles: true,
				composed: true,
				detail: { key: this.key, selected: this._selected }
			}));

		}
	}

	connectedCallback() {
		super.connectedCallback();
		const evt = new CustomEvent('d2l-selection-checkbox-subscribe', {
			bubbles: true,
			composed: true,
			detail: {}
		});
		this.dispatchEvent(evt);
		this._provider = evt.detail.provider;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this._provider) return;
		this._provider.unsubscribeSelectable(this);
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
				?checked="${this.selected}"
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
		this.selected = e.target.checked;
	}

}

customElements.define('d2l-selection-checkbox', Checkbox);
