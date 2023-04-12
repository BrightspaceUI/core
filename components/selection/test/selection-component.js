import { css, html, LitElement } from 'lit';
import { PageableMixin } from '../../paging/pageable-mixin.js';
import { SelectionMixin } from '../selection-mixin.js';
import { SelectionObserverMixin } from '../selection-observer-mixin.js';

class TestBase extends LitElement {
	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}
	render() {
		return html`
			<slot></slot>
		`;
	}
}

class TestSelection extends SelectionMixin(TestBase) {}

class TestSelectionObserver extends SelectionObserverMixin(LitElement) {}

class TestSelectionObserverShadow extends SelectionObserverMixin(LitElement) {
	render() {
		return html`<d2l-test-selection-observer></d2l-test-selection-observer>`;
	}
}

class TestPageable extends PageableMixin(TestBase) {
	_getItemByIndex() {
		return null;
	}
	_getItemShowingCount() {
		return 1;
	}
}

class TestSelectionPageable extends SelectionMixin(TestPageable) {}

customElements.define('d2l-test-selection', TestSelection);
customElements.define('d2l-test-selection-observer', TestSelectionObserver);
customElements.define('d2l-test-selection-observer-shadow', TestSelectionObserverShadow);
customElements.define('d2l-test-pageable', TestPageable);
customElements.define('d2l-test-selection-pageable', TestSelectionPageable);
