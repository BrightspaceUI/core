import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { loadSvg } from '../../generated/icons/presetIconLoader.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { runAsync } from '../../directives/run-async.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class Icon extends RtlMixin(LitElement) {

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
			}
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

	render() {
		return html`${runAsync(this.icon ? this.icon : this.src, () => this._getIcon(), {
			success: (icon) => icon
		})}`;
	}

	async _fetchSvg(icon) {
		const svg = await loadSvg(icon);
		return this._fixSvg(svg ? svg.val : undefined);
	}

	async _fetchSrcSvg(src) {
		const response = await fetch(src);
		if (!response.ok) return;
		return this._fixSvg(await response.text());
	}

	_fixSvg(svgStr) {

		if (svgStr === undefined) {
			return undefined;
		}

		const elem = document.createElement('div');
		elem.innerHTML = svgStr;

		const svg = elem.firstChild;
		const paths = svg.querySelectorAll('path[fill]');
		paths.forEach((path) => {
			if (path.getAttribute('fill') !== 'none') path.removeAttribute('fill');
		});
		svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
		svg.setAttribute('focusable', 'false');
		svg.removeAttribute('height');
		svg.removeAttribute('width');

		return html`${unsafeHTML(elem.innerHTML)}`;

	}

	async _getIcon() {
		if (this.icon) return this._fetchSvg(this.icon);
		if (this.src && this.src.substr(this.src.length - 4) === '.svg') {
			return this._fetchSrcSvg(this.src);
		} else {
			return html`<img src="${this.src}" alt="">`;
		}
	}

}

customElements.define('d2l-icon', Icon);
