import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A subtle button that selects all items for all pages.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class SelectAllPages extends FocusMixin(LocalizeCoreElement(SelectionObserverMixin(LitElement))) {

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

	static get focusElementSelector() {
		return 'd2l-button-subtle';
	}

	render() {
		if (!this._provider) return;
		if (!this._provider.itemCount) return;
		if (this._provider.selectionSingle) return;
		if (this.selectionInfo.state !== SelectionInfo.states.all) return;

		return html`
			<d2l-button-subtle
				@click="${this._handleClick}"
				text="${this.localize('components.selection.select-all-items', 'count', this._provider.itemCount)}">
			</d2l-button-subtle>`;
	}

	_handleClick() {
		if (this._provider) this._provider.setSelectionForAll(true, true);
	}

}

customElements.define('d2l-selection-select-all-pages', SelectAllPages);
