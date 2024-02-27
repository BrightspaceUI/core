import '../../status-indicator/status-indicator.js';
import { css, html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { APCAcontrast, reverseAPCA, sRGBtoY, displayP3toY, adobeRGBtoY, alphaBlend, calcAPCA, fontLookupAPCA } from 'apca-w3';
import { colorParsley, colorToHex, colorToRGB } from 'colorparsley';  // optional string parsing


import { getColorContrast } from '../../../helpers/color0.js';


class ColorSwatchCustom extends LitElement {

	static get properties() {
		return {
			color: { type: String },
			backgroundColor: { type: String, attribute: 'background-color' },
			wcag2Contrast: { type: String, attribute: 'wcag2-contrast' }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			.container {
				display: flex;
				font-size: 16px;
				gap: 0.5rem;
			}
			.swatch {
				border-radius: 8px;
				box-sizing: border-box;
				display: block;
				font-weight: 400;
				padding: 1rem;
				width: 400px;
			}
			p {
				margin: 0;
			}
			.details {
				font-size: 0.7rem;
				line-height: 1.3rem;
				padding: 1rem;
			}
		`;
	}

	_getLuminanceContrast(hexColor1, hexColor2) {
		const getRgbColor = hexColor => {
			const temp = colorParsley(hexColor);
			return { r: temp[0], g: temp[1], b: temp[2] };
		};

		const rgbColor1 = getRgbColor(hexColor1);
		const rgbColor2 = getRgbColor(hexColor2);

		return getColorContrast(rgbColor1, rgbColor2);
	}

	render() {
		const showAPCA = true;

		const textStyles = {
			color: this.color,
			backgroundColor: this.backgroundColor
		};
		const separatorStyles = {
			borderColor: this.color
		};

		const colorTuple = colorParsley(this.color);
		const bgColorTuple = colorParsley(this.backgroundColor);

		const colorY = sRGBtoY(colorTuple);
		const bgColorY = sRGBtoY(bgColorTuple);

		const Lc = Math.abs(APCAcontrast(colorY, bgColorY)).toFixed(0);
		console.log("Lightness Contrast Lc", Lc);

		const Yc = this._getLuminanceContrast(this.color, this.backgroundColor).toFixed(2);

		return html`
			<div class="container">
				<div class="swatch" style="${styleMap(textStyles)}">
					<div>${this.color}; ${this.backgroundColor}</div>
					<hr style="${styleMap(separatorStyles)}">
					<p>Grumpy wizards make toxic brew for the evil Queen and Jack. Grumpy wizards make toxic brew for the evil Queen and Jack.</p>
				</div>
				<div class="details">
					<div>WCAG2 Contrast: ${Yc}:1</div>
					<div>Normal:
						<d2l-status-indicator state="${Yc >= 4.5 ? 'success' : 'alert'}" text="${Yc >= 4.5 ? 'Pass AA' : 'Fail AA'}"></d2l-status-indicator>
						<d2l-status-indicator state="${Yc >= 7 ? 'success' : 'alert'}" text="${Yc >= 7 ? 'Pass AAA' : 'Fail AAA'}"></d2l-status-indicator>
					</div>
					<div>Large:
						<d2l-status-indicator state="${Yc >= 3 ? 'success' : 'alert'}" text="${Yc >= 3 ? 'Pass AA' : 'Fail AA'}"></d2l-status-indicator>
						<d2l-status-indicator state="${Yc >= 4.5 ? 'success' : 'alert'}" text="${Yc >= 4.5 ? 'Pass AAA' : 'Fail AAA'}"></d2l-status-indicator>
					</div>
					${showAPCA ? html`
						<hr>
						<div>APCA Contrast: ${Lc}</div>
						<div>Body (L<sub>c</sub>75):
							<d2l-status-indicator state="${Lc >= 75 ? 'success' : 'alert'}" text="${Lc >= 75 ? 'Pass' : 'Fail'}"></d2l-status-indicator>
						</div>
						<div>Non-Body (L<sub>c</sub>60):
							<d2l-status-indicator state="${Lc >= 60 ? 'success' : 'alert'}" text="${Lc >= 60 ? 'Pass' : 'Fail'}"></d2l-status-indicator>
						</div>
					` : null}
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-color-swatch-custom', ColorSwatchCustom);
