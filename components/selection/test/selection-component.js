import { css, html, LitElement } from 'lit';
import { SelectionMixin } from '../selection-mixin.js';
import { SelectionObserverMixin } from '../selection-observer-mixin.js';

class TestSelection extends SelectionMixin(LitElement) {
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

class TestSelectionObserver extends SelectionObserverMixin(LitElement) {}

class TestSelectionObserverShadow extends SelectionObserverMixin(LitElement) {
	render() {
		return html`<d2l-test-selection-observer></d2l-test-selection-observer>`;
	}
}

customElements.define('d2l-test-selection', TestSelection);
customElements.define('d2l-test-selection-observer', TestSelectionObserver);
customElements.define('d2l-test-selection-observer-shadow', TestSelectionObserverShadow);
