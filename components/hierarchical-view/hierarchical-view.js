import { css, html, LitElement } from 'lit';
import { HierarchicalViewMixin } from '../hierarchical-view/hierarchical-view-mixin.js';

/**
 * @fires d2l-hierarchical-view-hide-start
 * @fires d2l-hierarchical-view-show-complete
 * @fires d2l-hierarchical-view-show-start
 */
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
