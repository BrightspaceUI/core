import '../selection/selection-checkbox.js';
import { css, html } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LabelledMixin } from '../../mixins/labelled-mixin.js';
import { nothing } from 'lit-html';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export const ListItemCheckboxMixin = superclass => class extends SkeletonMixin(LabelledMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Disables the checkbox
			 */
			disabled: { type: Boolean },
			/**
			 * Value to identify item if selectable
			 */
			key: { type: String, reflect: true },
			/**
			 * Indicates a checkbox should be rendered for selecting the item
			 */
			selectable: { type: Boolean },
			/**
			 * Whether the item is selected
			 */
			selected: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		const styles = css`
			.d2l-checkbox-action {
				cursor: pointer;
				display: block;
				height: 100%;
			}
			.d2l-checkbox-action.d2l-checkbox-action-disabled {
				cursor: default;
			}
		`;

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._checkboxId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.selectable) {
			if (!this.key) console.warn('ListItemCheckboxMixin requires a key.');
			if (!this.label || this.label.length === 0) console.warn('ListItemCheckboxMixin requires a label.');
		}
		if (!this.key) this.setSelected(undefined, true);
	}

	setSelected(selected, suppressEvent = false) {
		if (this.selected === selected) return;
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	_dispatchSelected(value) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-selected', {
			detail: { key: this.key, selected: value },
			bubbles: true
		}));
	}

	_onCheckboxActionClick(event) {
		event.preventDefault();
		if (this.disabled) return;
		this.setSelected(!this.selected);
		const checkbox = this.shadowRoot.querySelector(`#${this._checkboxId}`);
		if (checkbox) checkbox.focus();
	}

	_onCheckboxChange(event) {
		this.setSelected(event.target.selected);
	}

	_renderCheckbox() {
		return this.selectable ? html`
			<d2l-selection-checkbox
				@d2l-selection-change="${this._onCheckboxChange}"
				?selected="${this.selected}"
				?disabled="${this.disabled}"
				id="${this._checkboxId}"
				key="${this.key}"
				label="${this.label}"
				?skeleton="${this.skeleton}">
			</d2l-selection-checkbox>
		` : nothing;
	}

	_renderCheckboxAction(inner) {
		const classes = {
			'd2l-checkbox-action': true,
			'd2l-checkbox-action-disabled': this.disabled
		};
		return this.selectable ? html`
			<div @click="${this._onCheckboxActionClick}"
				class="${classMap(classes)}">
				${inner}
			</div>
			` : nothing;
	}
};
