import { css, html, LitElement, unsafeCSS } from 'lit';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const documentLocaleSettings = getDocumentLocaleSettings();

const offscreenStyleDeclarations = css`
		direction: var(--d2l-document-direction);
		height: 1px;
		inset-inline-start: -10000px;
		left: -10000px;
		overflow: hidden;
		position: absolute !important;
		white-space: nowrap;
		width: 1px;
`;

export const offscreenStyles = css`
	.d2l-offscreen {
		${offscreenStyleDeclarations}
	}
	:host([dir="rtl"]) .d2l-offscreen {
		left: 0;
		right: -10000px;
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
			:host([dir="rtl"]) {
				left: 0;
				right: -10000px;
			}
		`;
	}
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define('d2l-offscreen', Offscreen);
