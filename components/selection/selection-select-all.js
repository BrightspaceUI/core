import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A checkbox that provides select-all behavior for selection components such as tables and lists.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class SelectAll extends LocalizeCoreElement(SelectionObserverMixin(LitElement)) {

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

	render() {
		if (this._provider && this._provider.selectionSingle) return;

		const summary = (this.selectionInfo.state === SelectionInfo.states.none ? this.localize('components.selection.select-all')
			: this.localize('components.selection.selected', 'count', this.selectionInfo.keys.length));

		return html`
			<d2l-input-checkbox
				aria-label="${this.localize('components.selection.select-all')}"
				@change="${this._handleCheckboxChange}"
				?checked="${this.selectionInfo.state === SelectionInfo.states.all || this.selectionInfo.state === SelectionInfo.states.allPages}"
				?disabled="${this.disabled}"
				description="${ifDefined(this.selectionInfo.state !== SelectionInfo.states.none ? summary : undefined)}"
				?indeterminate="${this.selectionInfo.state === SelectionInfo.states.some}">
			</d2l-input-checkbox>
		`;
	}

	focus() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('d2l-input-checkbox');
		if (elem) elem.focus();
	}

	_handleCheckboxChange(e) {
		if (this._provider) this._provider.setSelectionForAll(e.target.checked, false);
	}

}

customElements.define('d2l-selection-select-all', SelectAll);
