import { css, html, LitElement } from 'lit';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A component that renders collapsible panels
 * @slot default - Slot for panels. Only accepts `d2l-collapsible-panel`
 */
class CollapsiblePanelGroup extends SkeletonMixin(LitElement) {

	static get styles() {
		return [super.styles, css`
			:host ::slotted(*) {
				display: none;
			}
			:host ::slotted(d2l-collapsible-panel) {
				display: unset;
			}
		`];
	}

	render() {
		return html`<slot></slot>`;
	}
}

customElements.define('d2l-collapsible-panel-group', CollapsiblePanelGroup);
