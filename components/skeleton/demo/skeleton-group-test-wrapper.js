import { css, html, LitElement } from 'lit';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

class SkeletonGroupTestWrapper extends SkeletonGroupMixin(LitElement) {
	static get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				gap: 0.3rem;
			}
		`;
	}
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define('d2l-skeleton-group-test-wrapper', SkeletonGroupTestWrapper);
