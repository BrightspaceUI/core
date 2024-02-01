import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

const offscreenStyleDeclarations = css`
		direction: var(--d2l-document-direction, ${document.dir === "rtl" ? css`rtl` : css`ltr`});
		height: 1px;
		inset-inline-start: -10000px;
		overflow: hidden;
		position: absolute !important;
		white-space: nowrap;
		width: 1px;
		${document.dir === 'rtl' ? css`right` : css`left`}: -10000px;
`;

export const offscreenStyles = css`
	.d2l-offscreen {
		${offscreenStyleDeclarations}
	}
`;

/**
 * A component for positioning content offscreen to only be visible to screen readers.
 * @slot - Default content placed inside of the component
 */
class Offscreen extends RtlMixin(LitElement) {
	static get styles() {
		return css`
			:host {
				${offscreenStyleDeclarations}
			}
		`;
	}
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define('d2l-offscreen', Offscreen);
