import '../selection/selection-input.js';
import { css, html, nothing } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { SelectionInfo } from '../selection/selection-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export const ListItemCheckboxMixin = superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		return {
			/**
			 * **Selection:** Disables selection
			 * @type {boolean}
			 */
			selectionDisabled: { type: Boolean, attribute: 'selection-disabled', reflect: true },
			/**
			 * **Selection:** Value to identify item if selectable
			 * @type {string}
			 */
			key: { type: String, reflect: true },
			/**
			 * **Selection:** Indicates an input should be rendered for selecting the item
			 * @type {boolean}
			 */
			selectable: { type: Boolean },
			/**
			 * **Selection:** Whether the item is selected
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * Private. The selection info (set by the selection component).
			 * @ignore
			 */
			selectionInfo: { type: Object, attribute: false },
			_hoveringSelection: { type: Boolean, attribute: '_hovering-selection', reflect: true }
		};
	}

	static get styles() {
		const styles = [ css`
			.d2l-checkbox-action {
				cursor: pointer;
				display: block;
				height: 100%;
			}
			:host([selection-disabled]) .d2l-checkbox-action {
				cursor: default;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.selectable = false;
		this.selected = false;
		this.selectionDisabled = false;
		this.selectionInfo = new SelectionInfo();
		this._checkboxId = getUniqueId();
	}

	get selectionInfo() {
		return this._selectionInfo;
	}

	set selectionInfo(val) {
		const oldVal = this._selectionInfo;
		if (oldVal !== val) {
			this._selectionInfo = val;
			this.setSelected(this._selectionInfo.state === SelectionInfo.states.all);
			this.requestUpdate('selectionInfo', oldVal);
		}
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.selectable) {
			if (!this.key) console.warn('ListItemCheckboxMixin requires a key.');
		}
		if (!this.key) this.setSelected(undefined, true);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!this._selectionProvider || !changedProperties.has('selectionInfo')) return;
		this.selected = (this.selectionInfo.state === SelectionInfo.states.all);
	}

	setSelected(selected, suppressEvent = false) {
		if (this.selected === selected || (this.selected === undefined && !selected)) return;
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('selectionDisabled') && this.selectionDisabled === true) this._hoveringSelection = false;
	}

	async _dispatchSelected(value) {
		/* wait for internal state to be updated in case of action-click case so that a consumer
		 calling getSelectionInfo will get the correct state */
		await this.updateComplete;
		/** Dispatched when the component item is selected */
		this.dispatchEvent(new CustomEvent('d2l-list-item-selected', {
			detail: { key: this.key, selected: value },
			composed: true,
			bubbles: true
		}));
	}

	_onCheckboxActionClick(event) {
		event.preventDefault();
		if (this.selectionDisabled) return;
		this.setSelected(!this.selected);
		const checkbox = this.shadowRoot && this.shadowRoot.querySelector(`#${this._checkboxId}`);
		if (checkbox) checkbox.focus();
	}

	_onCheckboxChange(event) {
		this.setSelected(event.target.selected);
		if (this._selectionProvider) {
			if (this.selected && this.selectionInfo.state !== SelectionInfo.states.all || !this.selected && this.selectionInfo.state === SelectionInfo.states.all) {
				this._selectionProvider.setSelectionForAll(this.selected);
			}
		}
	}

	_onCheckboxKeyDown(e) {
		// handle the enter key
		if (e.keyCode !== 13) return;
		this.setSelected(!this.selected);
	}

	_onMouseEnterSelection() {
		this._hoveringSelection = !this.selectionDisabled;
	}

	_onMouseLeaveSelection() {
		this._hoveringSelection = false;
	}

	_onNestedSlotChangeCheckboxMixin() {
		this._updateNestedSelectionProvider();
	}

	_onSelectionProviderConnected(e) {
		e.stopPropagation();
		this._updateNestedSelectionProvider();
	}

	_renderCheckbox() {
		return this.selectable ? html`
			<d2l-selection-input
				@d2l-selection-change="${this._onCheckboxChange}"
				?disabled="${this.selectionDisabled}"
				.hovering="${this._hoveringSelection}"
				id="${this._checkboxId}"
				?_indeterminate="${this.selectionInfo.state === SelectionInfo.states.some}"
				key="${this.key}"
				@keydown="${this._onCheckboxKeyDown}"
				label="${this.label}"
				?selected="${this.selected}"
				?skeleton="${this.skeleton}">
			</d2l-selection-input>
		` : nothing;
	}

	_renderCheckboxAction(inner) {
		return this.selectable ? html`
			<div class="d2l-checkbox-action"
				@click="${this._onCheckboxActionClick}"
				@mouseenter="${this._onMouseEnterSelection}"
				@mouseleave="${this._onMouseLeaveSelection}">
				${inner}
			</div>
			` : nothing;
	}

	_updateNestedSelectionProvider() {
		if (!this.selectable) return;

		const nestedList = this._getNestedList();
		if (this._selectionProvider === nestedList) return;

		if (this._selectionProvider && this._selectionProvider !== nestedList) {
			this._selectionProvider.unsubscribeObserver(this);
			this._selectionProvider = null;
		}

		if (nestedList) {
			this._selectionProvider = nestedList;
			this._selectionProvider.subscribeObserver(this);
		}
	}

};
