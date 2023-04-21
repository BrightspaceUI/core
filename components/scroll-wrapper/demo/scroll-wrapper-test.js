import '../scroll-wrapper.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RtlMixin } from '../../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

class TestScrollWrapper extends RtlMixin(LitElement) {

	static get properties() {
		return {
			hideActions: { attribute: 'hide-actions', type: Boolean },
			scroll: { attribute: 'scroll', type: Number },
			splitScrollers: { attribute: 'split-scrollers', type: Boolean },
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
			.d2l-scroll-wrapper-gradient-secondary {
				background: linear-gradient(to left, #e66465, #9198e5);
				height: 40px;
			}
		`;
	}

	constructor() {
		super();
		this.hideActions = false;
		this.scroll = 0;
		this.splitScrollers = false;
		this.width = 300;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.scroll !== 0) {
			requestAnimationFrame(() => this.shadowRoot.querySelector('d2l-scroll-wrapper').scrollDistance(this.scroll, false));
		}
		if (this.splitScrollers) {
			this._scrollers = { primary: this.shadowRoot.querySelector('.primary'), secondary: this.shadowRoot.querySelectorAll('.secondary') };
		}
	}

	render() {
		const style = {
			width: `${this.width}px`
		};

		const contents = this.splitScrollers ? html`
			<div class="secondary">
				<div class="d2l-scroll-wrapper-gradient-secondary" style="${styleMap(style)}">Secondary scroller (Can't scroll independently)</div>
			</div>
			<div class="primary">
				<div class="d2l-scroll-wrapper-gradient" style="${styleMap(style)}"></div>
			</div>
			<div class="secondary">
				<div class="d2l-scroll-wrapper-gradient-secondary" style="${styleMap(style)}">Secondary scroller (Can't scroll independently)</div>
			</div>
		` : html`<div class="d2l-scroll-wrapper-gradient" style="${styleMap(style)}"></div>`;

		return html`
			<d2l-scroll-wrapper ?hide-actions="${this.hideActions}" .scrollers="${ifDefined(this._scrollers)}">
				${contents}
			</d2l-scroll-wrapper>
		`;
	}

	focus() {
		if (this.shadowRoot) this.shadowRoot.querySelector('d2l-scroll-wrapper')._container.focus();
	}

}
customElements.define('d2l-test-scroll-wrapper', TestScrollWrapper);
