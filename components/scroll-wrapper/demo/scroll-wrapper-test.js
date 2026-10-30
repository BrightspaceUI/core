import '../scroll-wrapper.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../../helpers/localize-core-element.js';
import { styleMap } from 'lit/directives/style-map.js';

class TestScrollWrapper extends LocalizeCoreElement(LitElement) {

	static properties = {
		hideActions: { attribute: 'hide-actions', type: Boolean },
		scroll: { attribute: 'scroll', type: Number },
		splitScrollers: { attribute: 'split-scrollers', type: Boolean },
		stickyContent: { attribute: 'sticky-content', type: Boolean, reflect: true },
		width: { type: Number },
		_customScrollers: { state: true }
	};

	static styles = css`
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
		:host([sticky-content]) .d2l-scroll-wrapper-gradient div {
			display: inline-block;
		}
		.sticky {
			border-inline-end: 1px solid black;
			inset-inline-start: 0;
			position: sticky;
			position: -webkit-sticky;
			width: 200px;
		}
	`;

	constructor() {
		super();
		this.hideActions = false;
		this.scroll = 0;
		this.splitScrollers = false;
		this.stickyContent = false;
		this.width = 300;
		this._customScrollers = {};
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.scrollDistance();
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
		const mainContent = html`
			<div class="d2l-scroll-wrapper-gradient" style="${styleMap(style)}">
				${this.stickyContent ? html`<div class="sticky">
					<button>Sticky focusable</button>
				</div>
				<div class="not-sticky">
					<button>Another focusable</button>
				</div>` : nothing}
			</div>
		`;

		const contents = this.splitScrollers ? html`
			${secondaryScroller}
			<div class="primary">
				${mainContent}
			</div>
			${secondaryScroller}
		` : html`${mainContent}`;

		return html`
			<d2l-scroll-wrapper
				class="vdiff-target"
				?hide-actions="${this.hideActions}"
				scroll-area-offset=${ifDefined(this.stickyContent ? 200 : undefined)}
				.customScrollers="${this._customScrollers}">
				${contents}
			</d2l-scroll-wrapper>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('localize')) this.scrollDistance();
	}

	focus() {
		if (this.shadowRoot) this.shadowRoot.querySelector('d2l-scroll-wrapper')._container.focus();
	}

	async scrollDistance() {
		const scrollDir = document.documentElement.getAttribute('dir');
		if (this._dir === scrollDir) return;
		this._dir = scrollDir;

		if (this.scroll !== 0) {
			const wrapper = this.shadowRoot.querySelector('d2l-scroll-wrapper');
			await wrapper.updateComplete;
			requestAnimationFrame(() => wrapper.scrollDistance(this.scroll, false));
		}
	}

}
customElements.define('d2l-test-scroll-wrapper', TestScrollWrapper);
