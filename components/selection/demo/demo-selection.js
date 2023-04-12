import { css, html, LitElement } from 'lit';
import { PageableMixin } from '../../paging/pageable-mixin.js';
import { SelectionMixin } from '../selection-mixin.js';

class DemoBase extends LitElement {
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

class DemoSelection extends SelectionMixin(DemoBase) {}

class DemoPageable extends PageableMixin(DemoBase) {
	_getItemByIndex() {
		return null;
	}
	_getItemShowingCount() {
		return 3;
	}
}

class DemoSelectionPageable extends SelectionMixin(DemoPageable) {}

customElements.define('d2l-demo-selection', DemoSelection);
customElements.define('d2l-demo-pageable', DemoPageable);
customElements.define('d2l-demo-selection-pageable', DemoSelectionPageable);
