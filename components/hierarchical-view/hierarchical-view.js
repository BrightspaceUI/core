import { html, LitElement } from 'lit-element/lit-element.js';
import { HierarchicalViewMixin } from '../hierarchical-view/hierarchical-view-mixin.js';
import { hierarchicalViewStyles } from '../hierarchical-view/hierarchical-view-styles.js';

class HierarchicalView extends HierarchicalViewMixin(LitElement) {

	static get styles() {
		return hierarchicalViewStyles;
	}

	render() {
		return html`
			<div class="d2l-hierarchical-view-content">
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-hierarchical-view', HierarchicalView);
