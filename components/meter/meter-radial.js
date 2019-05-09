import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading4Styles } from '../typography/styles.js';

class MeterRadial extends LitElement {
	static get properties() {
		return {
			value: { type: Number },
			max: { type: Number }
		};
	}

	static get styles() {
		return [ heading4Styles, css`
		:host {
			display: inline-block;
			width: 86px;
		}
		.d2l-meter-radial-full-bar,
		.d2l-meter-radial-progress-bar {
			fill: none;
			stroke-linecap: round;
			stroke-width: 9;
		}
		.d2l-meter-radial-full-bar {
			stroke: var(--d2l-color-gypsum);
		}
		.d2l-meter-radial-progress-bar {
			stroke: var(--d2l-color-celestine);
		}
		.d2l-meter-radial-text {
			color: var(--d2l-color-ferrite);
		}
	` ];
	}

	render() {
		const lengthOfLine = 115; // found by approximating half the perimeter of the ellipse with radii 38 and 35
		const progressFill = this.value / this.max * lengthOfLine;
		return html `
			<svg viewBox="0 0 86 52" >
				<g transform="translate(5 47)">
					<path class="d2l-meter-radial-full-bar" d="M5 47a38 35 0 0 1 76 0" />
					<path
						class="d2l-meter-radial-progress-bar"
						d="M5 47a38 35 0 0 1 76 0"
						stroke-dasharray="${progressFill} ${lengthOfLine}"
						visibility="${this.value ? 'visible' : 'hidden'}" />
					<text class="d2l-heading-4 d2l-meter-radial-text" x="38" y="2" text-anchor="middle"  transform="translate(5 47)">
						${this.value}/${this.max}
					</text>
				</g>
			</svg>
		`;
	}
}

customElements.define('d2l-meter-radial', MeterRadial);
