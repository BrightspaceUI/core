import '../scroll-wrapper.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class TestScrollWrapper extends RtlMixin(LitElement) {

	static get properties() {
		return {
			hideActions: { attribute: 'hide-actions', type: Boolean },
			scroll: { attribute: 'scroll', type: Number },
			width: { type: Number }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			.d2l-scroll-wrapper-gradient {
				background: linear-gradient(to right, #e66465, #9198e5);
				height: 100px;
			}
		`;
	}

	constructor() {
		super();
		this.hideActions = false;
		this.scroll = 0;
		this.width = 300;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.scroll === 0) return;
		requestAnimationFrame(() => {
			this.shadowRoot.querySelector('d2l-scroll-wrapper').scrollDistance(this.scroll, false);
		});
	}

	render() {
		const style = {
			width: `${this.width}px`
		};
		return html`
			<d2l-scroll-wrapper ?hide-actions="${this.hideActions}">
				<div class="d2l-scroll-wrapper-gradient" style="${styleMap(style)}"></div>
			</d2l-scroll-wrapper>
		`;
	}

	focusRightScrollButton() {
		this.shadowRoot.querySelector('d2l-scroll-wrapper')
			.shadowRoot.querySelector('.d2l-scroll-wrapper-button-right').focus();
	}

}
customElements.define('d2l-test-scroll-wrapper', TestScrollWrapper);
