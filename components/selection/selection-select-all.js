import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A checkbox that provides select-all behavior for selection components such as tables and lists.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class SelectAll extends FocusMixin(LocalizeCoreElement(SelectionObserverMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Disables the select all checkbox
			 * @type {boolean}
			 */
			disabled: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				line-height: normal;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.disabled = false;
	}

	static get focusElementSelector() {
		return 'd2l-input-checkbox';
	}

	render() {
		if (!this._provider || this._provider.selectionSingle) return;

		const summary = (this.selectionInfo.state === SelectionInfo.states.none ? this.localize('components.selection.select-all')
			: this.localize('components.selection.selected', 'count', this.selectionInfo.keys.length));
		const indeterminate = this.selectionInfo.state === SelectionInfo.states.some
			|| (this.selectionInfo.state === SelectionInfo.states.all && this.selectionInfo.numDisabledKeys > 0);

		return html`
			<d2l-input-checkbox
				aria-label="${this.localize('components.selection.select-all')}"
				@change="${this._handleCheckboxChange}"
				?checked="${this.selectionInfo.state === SelectionInfo.states.all || this.selectionInfo.state === SelectionInfo.states.allPages}"
				?disabled="${this.disabled}"
				description="${ifDefined(this.selectionInfo.state !== SelectionInfo.states.none ? summary : undefined)}"
				?indeterminate="${indeterminate}">
			</d2l-input-checkbox>
		`;
	}

	_handleCheckboxChange(e) {
		if (this._provider) this._provider.setSelectionForAll(e.target.checked, false);
	}

}

customElements.define('d2l-selection-select-all', SelectAll);
