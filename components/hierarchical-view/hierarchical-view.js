import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HierarchicalViewMixin } from '../hierarchical-view/hierarchical-view-mixin.js';

class HierarchicalView extends HierarchicalViewMixin(LitElement) {

	static get styles() {
		return [ super.styles, css`
			:host {
				display: inline-block;
			}
		`];
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
