import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { selectionStates } from './selection-mixin.js';
import { SelectionSubscriberMixin } from './selection-subscriber-mixin.js';

/**
 * A checkbox that provides select-all behavior for selection components such as tables and lists.
 * @fires d2l-selection-select-all-change - Dispatched when the user toggles the checkox
 */
class SelectAll extends LocalizeCoreElement(SelectionSubscriberMixin(LitElement)) {

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

	render() {
		const summary = (this.selectionInfo.state === selectionStates.none ? this.localize('components.selection.select-all')
			: this.localize('components.selection.selected', 'count', this.selectionInfo.keys.length));

		return html`
			<d2l-input-checkbox
				aria-label="${this.localize('components.selection.select-all')}"
				@change="${this._handleCheckboxChange}"
				?checked="${this.selectionInfo.state === selectionStates.all}"
				description="${ifDefined(this.selectionInfo.state !== selectionStates.none ? summary : undefined)}"
				?indeterminate="${this.selectionInfo.state === selectionStates.some}">
			</d2l-input-checkbox>
		`;
	}

	_handleCheckboxChange(e) {
		this.dispatchEvent(new CustomEvent('d2l-selection-select-all-change', {
			bubbles: true,
			composed: true,
			detail: { checked: e.target.checked }
		}));
	}

}

customElements.define('d2l-selection-select-all', SelectAll);
