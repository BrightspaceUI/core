import { html, LitElement } from 'lit-element/lit-element.js';
import { HierarchicalViewMixin } from '../hierarchical-view/hierarchical-view-mixin.js';

class HierarchicalView extends HierarchicalViewMixin(LitElement) {

	render() {
		return html`
			<div class="d2l-hierarchical-view-content">
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-hierarchical-view', HierarchicalView);
