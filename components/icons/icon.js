import { css, html, LitElement } from 'lit-element/lit-element.js';
import { loadSvg } from '../../.generated/icons/presetIconLoader.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export class D2LIcon extends RtlMixin(LitElement) {

	static get properties() {
		return {
			icon: {
				type: String,
				reflect: true
			},
			size: {
				type: String,
				reflect: true
			},
			src: {
				type: String,
				reflect: true
			},
			__imgSrc: { type: String },
			__svg: { type: Object }
		};
	}

	constructor() {
		super();
		this.size = 'tier1';
	}

	static get styles() {
		return css`
			:host {
				-ms-flex-align: center;
				-webkit-align-items: center;
				align-items: center;
				color: var(--d2l-color-ferrite);
				display: -ms-inline-flexbox;
				display: -webkit-inline-flex;
				display: inline-flex;
				fill: var(--d2l-icon-fill-color, currentcolor);
				height: var(--d2l-icon-height, 18px);
				-ms-flex-pack: center;
				-webkit-justify-content: center;
				justify-content: center;
				stroke: var(--d2l-icon-stroke-color, none);
				vertical-align: middle;
				width: var(--d2l-icon-width, 18px);
			}
			:host([hidden]) {
				display: none;
			}
			:host([size="tier2"]) {
				height: var(--d2l-icon-height, 24px);
				width: var(--d2l-icon-width, 24px);
			}
			:host([size="tier3"]) {
				height: var(--d2l-icon-height, 30px);
				width: var(--d2l-icon-width, 30px);
			}
			:host([icon*="d2l-tier1:"]) {
				height: var(--d2l-icon-height, 18px);
				width: var(--d2l-icon-width, 18px);
			}
			:host([icon*="d2l-tier2:"]) {
				height: var(--d2l-icon-height, 24px);
				width: var(--d2l-icon-width, 24px);
			}
			:host([icon*="d2l-tier3:"]) {
				height: var(--d2l-icon-height, 30px);
				width: var(--d2l-icon-width, 30px);
			}
			svg, img {
				display: block;
				height: 100%;
				pointer-events: none;
				width: 100%;
			}
			:host([dir="rtl"]) svg[mirror-in-rtl] {
				-webkit-transform: scale(-1,1);
				transform: scale(-1,1);
				transform-origin: center;
			}
		`;
	}

	attributeChangedCallback(name, oldval, newval) {
		if (name === 'icon') {
			this.__fetchSvg(newval);
		} else if (name === 'src') {
			if (newval && newval.substr(newval.length - 4) === '.svg') {
				this.__fetchSrcSvg(newval);
			} else {
				this.__svg = undefined;
				this.__imgSrc = newval;
			}
		}
		super.attributeChangedCallback(name, oldval, newval);
	}

	shouldUpdate(changedProperties) {
		const shouldUpdate = changedProperties.has('__svg')
			|| changedProperties.has('__imgSrc');
		return shouldUpdate;
	}

	render() {
		if (this.__svg) {
			return this.__svg;
		}
		if (this.__imgSrc) {
			return html`<img src="${this.src}" alt="">`;
		}
	}

	async __fetchSvg(icon) {
		this.__svg = this.__fixSvg(await loadSvg(icon));
	}

	async __fetchSrcSvg(src) {
		const response = await fetch(src);
		if (!response.ok) {
			this.__svg = undefined;
			return;
		}
		this.__svg = this.__fixSvg(await response.text());
	}

	__fixSvg(svgStr) {

		if (svgStr === undefined) {
			return undefined;
		}

		const elem = document.createElement('div');
		elem.innerHTML = svgStr;

		const svg = elem.firstChild;
		const paths = svg.querySelectorAll('path[fill]');
		paths.forEach((path) => {
			path.removeAttribute('fill');
		});
		svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
		svg.setAttribute('focusable', 'false');
		svg.removeAttribute('height');
		svg.removeAttribute('width');

		return html`${unsafeHTML(elem.innerHTML)}`;

	}

}

customElements.define('d2l-icon', D2LIcon);
