import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A checkbox that provides select-all behavior for selection components such as tables and lists.
 * @fires d2l-selection-select-all-change - Dispatched when the user toggles the checkox
 */
class SelectAll extends LocalizeCoreElement(SelectionObserverMixin(LitElement)) {

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

	render() {
		if (this._provider && this._provider.selectionSingle) return;

		const summary = (this.selectionInfo.state === SelectionInfo.states.none ? this.localize('components.selection.select-all')
			: this.localize('components.selection.selected', 'count', this.selectionInfo.keys.length));

		return html`
			<d2l-input-checkbox
				aria-label="${this.localize('components.selection.select-all')}"
				@change="${this._handleCheckboxChange}"
				?checked="${this.selectionInfo.state === SelectionInfo.states.all}"
				description="${ifDefined(this.selectionInfo.state !== SelectionInfo.states.none ? summary : undefined)}"
				?indeterminate="${this.selectionInfo.state === SelectionInfo.states.some}">
			</d2l-input-checkbox>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-checkbox');
		if (elem) elem.focus();
	}

	_handleCheckboxChange(e) {
		if (!this.subscribedTo) {
			this.dispatchEvent(new CustomEvent('d2l-selection-select-all-change', {
				bubbles: true,
				composed: true,
				detail: { checked: e.target.checked }
			}));
		} else {
			if (this._provider) this._provider.setSelectionForAll(e.target.checked);
		}
	}

}

customElements.define('d2l-selection-select-all', SelectAll);
