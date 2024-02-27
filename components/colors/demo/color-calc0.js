import { css, html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { bodyCompactStyles } from '../../typography/styles.js';
import * as ColorHelper from '../../../helpers/color.js';

window.ColorHelper = ColorHelper;

class ColorCalc extends LitElement {

	static get properties() {
		return {
			color1: { type: String, reflect: true, attribute: 'color-1' },
			bgColor1: { type: String, reflect: true, attribute: 'bg-color-1' },
			bgColor2: { type: String, reflect: true, attribute: 'bg-color-2' },
			_bgRgbColor1: { state: true },
			_bgRgbColor2: { state: true },
			_rgbColor1: { state: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				display: block;
			}
			.container {
				box-sizing: border-box;
				display: flex;
				gap: 12px;
			}
			.container > div {
				box-sizing: border-box;
				border: 1px solid var(--d2l-color-border-subtle);
				border-radius: 8px;
				flex: none;
				padding: 12px;
				width: 260px;
			}
		`];
	}

	constructor() {
		super();
		this._rgbColor1 = { r:0, g:0, b:0 };
		this._bgRgbColor1 = { r:0, g:0, b:0 };
		this._bgRgbColor2 = { r:0, g:0, b:0 };
	}

	render() {
		const color1Hsl = ColorHelper.convertRGBToHSL(this._rgbColor1);
		const color1Contrast = ColorHelper.getColorContrast(this._rgbColor1, this._bgRgbColor1);

		const color1aContrast = ColorHelper.getColorContrast(this._rgbColor1, this._bgRgbColor2);

		const color2Hsl = ColorHelper.getApproxAlternateColor(this._rgbColor1, this._bgRgbColor1, this._bgRgbColor2);
		const color2Rgb = ColorHelper.convertHSLToRGB(color2Hsl);
		const color2Contrast = ColorHelper.getColorContrast(color2Rgb, this._bgRgbColor2);

		const color3Hsl = ColorHelper.getAlternateColor(this._rgbColor1, this._bgRgbColor1, this._bgRgbColor2);
		const color3Rgb = ColorHelper.convertHSLToRGB(color3Hsl);
		const color3Contrast = ColorHelper.getColorContrast(color3Rgb, this._bgRgbColor2);

		const color1Style = {
			color: this.color1.startsWith('--') ? `var(${this.color1})` : this.color1,
			backgroundColor: this.bgColor1.startsWith('--') ? `var(${this.bgColor1})` : this.bgColor1
		};
		const color1aStyle = {
			color: this.color1.startsWith('--') ? `var(${this.color1})` : this.color1,
			backgroundColor: this.bgColor2.startsWith('--') ? `var(${this.bgColor2})` : this.bgColor2
		};
		const color2Style = {
			color: ColorHelper.formatHsl(color2Hsl),
			backgroundColor: this.bgColor2.startsWith('--') ? `var(${this.bgColor2})` : this.bgColor2
		};
		const color3Style = {
			color: ColorHelper.formatHsl(color3Hsl),
			backgroundColor: this.bgColor2.startsWith('--') ? `var(${this.bgColor2})` : this.bgColor2
		};

		return html`
			<div class="container d2l-body-compact">
				<div class="color1" style="${styleMap(color1Style)}">
					<div>${this.color1}</div>
					<div>${ColorHelper.formatHex(this._rgbColor1)}</div>
					<div>${ColorHelper.formatRgb(this._rgbColor1)}</div>
					<div>${ColorHelper.formatHsl(color1Hsl)}</div>
					<div>contrast: ${color1Contrast.toFixed(2)} : 1</div>
				</div>
				<div class="color1a" style="${styleMap(color1aStyle)}">
					<div>no adjustment</div>
					<div>${ColorHelper.formatHex(this._rgbColor1)}</div>
					<div>${ColorHelper.formatRgb(this._rgbColor1)}</div>
					<div>${ColorHelper.formatHsl(color1Hsl)}</div>
					<div>contrast: ${color1aContrast.toFixed(2)} : 1</div>
				</div>
				<div class="color2" style="${styleMap(color2Style)}">
					<div>L ➡️ L*</div>
					<div>${ColorHelper.formatHex(color2Rgb)}</div>
					<div>${ColorHelper.formatRgb(color2Rgb)}</div>
					<div>${ColorHelper.formatHsl(color2Hsl)}</div>
					<div>contrast: ${color2Contrast.toFixed(2)} : 1</div>
				</div>
				<div class="color3" style="${styleMap(color3Style)}">
					<div>L ➡️ L* 🔄 L**</div>
					<div>${ColorHelper.formatHex(color3Rgb)}</div>
					<div>${ColorHelper.formatRgb(color3Rgb)}</div>
					<div>${ColorHelper.formatHsl(color3Hsl)}</div>
					<div>contrast: ${color3Contrast.toFixed(2)} : 1</div>
				</div>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('color1') || changedProperties.has('bgColor1') || changedProperties.has('bgColor2')) {
			this._rgbColor1 = ColorHelper.parseRGB(window.getComputedStyle(this.shadowRoot.querySelector('.color1')).color);
			this._bgRgbColor1 = ColorHelper.parseRGB(window.getComputedStyle(this.shadowRoot.querySelector('.color1')).backgroundColor);
			this._bgRgbColor2 = ColorHelper.parseRGB(window.getComputedStyle(this.shadowRoot.querySelector('.color2')).backgroundColor);
		}
	}

}

customElements.define('d2l-color-calc', ColorCalc);
