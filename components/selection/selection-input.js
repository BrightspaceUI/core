import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LabelledMixin } from '../../mixins/labelled-mixin.js';
import { radioStyles } from '../inputs/input-radio-styles.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const keyCodes = {
	SPACE: 32
};

/**
 * An input (radio or checkbox) for use in selection components such as lists and tables.
 * @fires d2l-selection-change - Dispatched when the selected state changes
 */
class Input extends SkeletonMixin(LabelledMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * State of the input
			 */
			selected: { type: Boolean },
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * Private. Force hovering state of input
			 */
			hovering: { type: Boolean },
			/**
			 * Key for the selectable
			 */
			key: { type: String },
			_indeterminate: { type: Boolean },
			_provider: { type: Object }
		};
	}

	static get styles() {
		return [ super.styles, radioStyles, css`
			:host {
				display: inline-block;
				line-height: normal;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.selected = false;
		this._indeterminate = false;
	}

	connectedCallback() {
		super.connectedCallback();
		// delay subscription otherwise import/upgrade order can cause selection mixin to miss event
		requestAnimationFrame(() => {
			const evt = new CustomEvent('d2l-selection-input-subscribe', {
				bubbles: true,
				composed: true,
				detail: {}
			});
			this.dispatchEvent(evt);
			this._provider = evt.detail.provider;
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this._provider) return;
		this._provider.unsubscribeSelectable(this);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.key || this.key.length === 0) console.warn('d2l-selection-input component requires a key.');
	}

	render() {
		if (!this._provider) return;
		if (this._provider.selectionSingle) {
			const radioClasses = {
				'd2l-input-radio': true,
				'd2l-selection-input-radio': true,
				'd2l-skeletize': true,
				'd2l-hovering': this.hovering
			};
			return html`
				<div
					aria-label="${this.label}"
					aria-checked="${this.selected ? 'true' : 'false'}"
					class="${classMap(radioClasses)}"
					@click="${this._handleRadioClick}"
					@keydown="${this._handleRadioKeyDown}"
					@keyup="${this._handleRadioKeyUp}"
					role="radio"
					tabindex="0"></div>
			`;
		} else {
			return html`
				<d2l-input-checkbox
					aria-label="${this.label}"
					@change="${this._handleCheckboxChange}"
					?checked="${this.selected}"
					class="${ifDefined(this.hovering ? 'd2l-hovering' : undefined)}"
					?disabled="${this.disabled}"
					?indeterminate="${this._indeterminate}"
					?skeleton="${this.skeleton}">
				</d2l-input-checkbox>
			`;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if ((changedProperties.has('selected') && !(changedProperties.get('selected') === undefined && this.selected === false))
			|| (changedProperties.has('_indeterminate') && !(changedProperties.get('_indeterminate') === undefined && this._indeterminate === false))) {

			// dispatch the event for all selected changes (not just when the user interacts directly with the input)
			this.dispatchEvent(new CustomEvent('d2l-selection-change', {
				bubbles: true,
				composed: true,
				detail: { key: this.key, indeterminate: this._indeterminate, selected: this.selected }
			}));

		}
	}

	focus() {
		const elem = this.shadowRoot.firstElementChild;
		if (elem) elem.focus();
	}

	_handleCheckboxChange(e) {
		e.stopPropagation();
		this.selected = e.target.checked;
	}

	_handleRadioClick(e) {
		e.stopPropagation();
		this.selected = true;
	}

	_handleRadioKeyDown(e) {
		if (e.keyCode === keyCodes.SPACE) e.preventDefault();
	}

	_handleRadioKeyUp(e) {
		if (e.keyCode === keyCodes.SPACE) this.selected = true;
	}

}

customElements.define('d2l-selection-input', Input);
