import '../../../node_modules/d2l-table/d2l-scroll-wrapper.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class TestScrollWrapper extends RtlMixin(LitElement) {

	static get properties() {
		return {
			showActions: { attribute: 'show-actions', type: Boolean },
			scroll: { attribute: 'scroll', type: Number },
			width: { type: Number }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			.gradient {
				background: linear-gradient(to right, #e66465, #9198e5);
				height: 100px;
			}
		`;
	}

	constructor() {
		super();
		this.scroll = 0;
		this.showActions = false;
		this.width = 300;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.scroll === 0) return;
		const amount = (this.getAttribute('dir') === 'rtl') ? this.scroll * -1 : this.scroll;
		this.shadowRoot.querySelector('d2l-scroll-wrapper').scroll(amount, false);
	}

	render() {
		const style = {
			width: `${this.width}px`
		};
		return html`
			<d2l-scroll-wrapper ?show-actions="${this.showActions}">
				<div class="gradient" style="${styleMap(style)}"></div>
			</d2l-scroll-wrapper>
		`;
	}

	focusRightScrollButton() {
		this.shadowRoot.querySelector('d2l-scroll-wrapper')
			.shadowRoot.querySelector('d2l-sticky-element > d2l-table-circle-button.right.action')
			.shadowRoot.querySelector('button').focus();
	}

}
customElements.define('d2l-test-scroll-wrapper', TestScrollWrapper);
