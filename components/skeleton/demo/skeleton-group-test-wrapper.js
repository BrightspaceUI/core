import { html, LitElement } from 'lit';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

class SkeletonGroupTestWrapper extends SkeletonGroupMixin(LitElement) {
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define('d2l-skeleton-group-test-wrapper', SkeletonGroupTestWrapper);
