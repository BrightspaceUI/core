import { css, html, LitElement } from 'lit';
import { fixSvg } from './fix-svg.js';
import { iconStyles } from './icon-styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

class IconCustom extends RtlMixin(LitElement) {

	static get properties() {
		return {
			size: {
				type: String,
				reflect: true
			}
		};
	}

	static get styles() {
		return [ iconStyles, css`
			:host([size="tier1"]) {
				height: var(--d2l-icon-height, 18px);
				width: var(--d2l-icon-width, 18px);
			}
			:host([size="tier2"]) {
				height: var(--d2l-icon-height, 24px);
				width: var(--d2l-icon-width, 24px);
			}
			:host([size="tier3"]) {
				height: var(--d2l-icon-height, 30px);
				width: var(--d2l-icon-width, 30px);
			}
		`];
	}

	render() {
		return html`<slot @slotchange="${this._handleSlotChange}"></slot>`;
	}

	_handleSlotChange(e) {
		const firstSvg = e.target.assignedNodes().find(
			node => node.nodeType === 1 && node.nodeName === 'svg'
		);
		if (firstSvg) {
			fixSvg(firstSvg);
		}
	}

}

customElements.define('d2l-icon-custom', IconCustom);
