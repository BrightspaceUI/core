import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LabelledMixin } from '../../mixins/labelled-mixin.js';
import { radioStyles } from '../inputs/input-radio-styles.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { SubscriberController } from '../../helpers/subscriptionControllers.js';

const keyCodes = {
	SPACE: 32
};

/**
 * An input (radio or checkbox) for use in selection components such as lists and tables.
 * @fires d2l-selection-change - Dispatched when the selected state changes
 * @fires d2l-selection-input-subscribe - Internal event
 */
class Input extends SkeletonMixin(LabelledMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * State of the input
			 * @type {boolean}
			 */
			selected: { type: Boolean },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean },
			/**
			 * Private. Force hovering state of input
			 * @ignore
			 * @type {boolean}
			 */
			hovering: { type: Boolean },
			/**
			 * REQUIRED: Key for the selectable
			 * @type {string}
			 */
			key: { type: String },
			_indeterminate: { type: Boolean }
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

		this._subscriberController = new SubscriberController(this,
			{ onSubscribe: () => { this.requestUpdate(); } },
			{ eventName: 'd2l-selection-input-subscribe', controllerId: 'input' }
		);
	}

	connectedCallback() {
		super.connectedCallback();
		this._subscriberController.hostConnected();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._subscriberController.hostDisconnected();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.key || this.key.length === 0) console.warn('d2l-selection-input component requires a key.');
	}

	render() {
		if (!this._subscriberController.provider) return;
		if (this._subscriberController.provider.selectionSingle) {
			const radioClasses = {
				'd2l-input-radio': true,
				'd2l-selection-input-radio': true,
				'd2l-skeletize': true,
				'd2l-hovering': this.hovering,
				'd2l-disabled': this.disabled
			};
			return html`
				<div
					aria-disabled="${ifDefined(this.disabled)}"
					aria-label="${this.label}"
					aria-checked="${this.selected ? 'true' : 'false'}"
					class="${classMap(radioClasses)}"
					@click="${this._handleRadioClick}"
					@keydown="${this._handleRadioKeyDown}"
					@keyup="${this._handleRadioKeyUp}"
					role="radio"
					tabindex="${ifDefined(this.disabled ? undefined : 0)}"></div>
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

		this._subscriberController.hostUpdated(changedProperties);

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
