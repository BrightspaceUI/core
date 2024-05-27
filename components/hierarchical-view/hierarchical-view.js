import { css, html, LitElement } from 'lit';
import { HierarchicalViewMixin } from '../hierarchical-view/hierarchical-view-mixin.js';

/**
 * @fires d2l-hierarchical-view-show-start - Dispatched when child view will be shown (before animation begins)
 * @fires d2l-hierarchical-view-show-complete - Dispatched when child view is shown (when animation ends)
 * @fires d2l-hierarchical-view-hide-start - Dispatched when child view will be hidden (before animation begins)
 * @fires d2l-hierarchical-view-hide-complete - Dispatched when child view is hidden (when animation ends)
 * @fires d2l-hierarchical-view-resize - Dispatched when child view is resized
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
