import '../scroll-wrapper.js';
import { css, html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

class TestScrollWrapper extends LitElement {

	static get properties() {
		return {
			hideActions: { attribute: 'hide-actions', type: Boolean },
			scroll: { attribute: 'scroll', type: Number },
			splitScrollers: { attribute: 'split-scrollers', type: Boolean },
			width: { type: Number },
			_customScrollers: { state: true }
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
				position: relative;
			}
			.d2l-scroll-wrapper-gradient-secondary button {
				inset-inline-end: 0;
				position: absolute;
				top: 0;
			}
		`;
	}

	constructor() {
		super();
		this.hideActions = false;
		this.scroll = 0;
		this.splitScrollers = false;
		this.width = 300;
		this._customScrollers = {};
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.scroll !== 0) {
			const wrapper = this.shadowRoot.querySelector('d2l-scroll-wrapper');
			await wrapper.updateComplete;
			requestAnimationFrame(() => wrapper.scrollDistance(this.scroll, false));
		}
		if (this.splitScrollers) {
			this._customScrollers = { primary: this.shadowRoot.querySelector('.primary'), secondary: this.shadowRoot.querySelectorAll('.secondary') };
		}
	}

	render() {
		const style = {
			width: `${this.width}px`
		};

		const secondaryScroller = html`
			<div class="secondary">
				<div class="d2l-scroll-wrapper-gradient-secondary" style="${styleMap(style)}">
					Secondary scroller (No mouse scroll)
					<button>Focus</button>
				</div>
			</div>
		`;

		const contents = this.splitScrollers ? html`
			${secondaryScroller}
			<div class="primary">
				<div class="d2l-scroll-wrapper-gradient" style="${styleMap(style)}"></div>
			</div>
			${secondaryScroller}
		` : html`<div class="d2l-scroll-wrapper-gradient" style="${styleMap(style)}"></div>`;

		return html`
			<d2l-scroll-wrapper class="vdiff-target" ?hide-actions="${this.hideActions}" .customScrollers="${this._customScrollers}">
				${contents}
			</d2l-scroll-wrapper>
		`;
	}

	focus() {
		if (this.shadowRoot) this.shadowRoot.querySelector('d2l-scroll-wrapper')._container.focus();
	}

}
customElements.define('d2l-test-scroll-wrapper', TestScrollWrapper);
