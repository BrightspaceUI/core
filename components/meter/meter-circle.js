import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';

class MeterCircle extends LitElement {
	static get properties() {
		return {
			value: { type: Number },
			max: { type: Number }
		};
	}

	static get styles() {
		return [ bodyStandardStyles, css`
		:host {
			display: inline-block;
			width: 2.4rem;
		}
		.d2l-meter-circle-full-bar,
		.d2l-meter-circle-progress-bar {
			fill: none;
			stroke-linecap: round;
			stroke-width: 6;
		}
		.d2l-meter-circle-full-bar {
			stroke: var(--d2l-color-gypsum);
		}
		.d2l-meter-circle-progress-bar {
			stroke: var(--d2l-color-celestine);
		}
		.d2l-meter-circle-text {
			fill: var(--d2l-color-ferrite);
			font-size: 0.6rem;
			line-height: 0;
		}
	` ];
	}

	render() {
		const lengthOfLine = 21 * Math.PI * 2; // approximation perimeter of circle
		const progressFill = this.value / this.max * lengthOfLine;
		const space = lengthOfLine - progressFill;
		const dashOffset = 7 * Math.PI * 2 - 10; // approximation perimeter of circle divide by 3 subtract the rounded edges (5 pixels each)
		return html `
			<svg viewBox="0 0 48 48" >
				<circle class="d2l-meter-circle-full-bar" cx="24" cy="24" r="21"/>
				<circle
					class="d2l-meter-circle-progress-bar"
					cx="24" cy="24" r="21"
					stroke-dasharray="${progressFill} ${space}"
					stroke-dashoffset="${dashOffset}"
					visibility="${this.value ? 'visible' : 'hidden'}" />
				<text class="d2l-body-standard d2l-meter-circle-text" x="24" y="25" text-anchor="middle" dominant-baseline="middle">
					${this.value}/${this.max}
				</text>
			</svg>
		`;
	}
}

customElements.define('d2l-meter-circle', MeterCircle);
