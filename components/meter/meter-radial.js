import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading4Styles } from '../typography/styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class MeterRadial extends RtlMixin(LitElement) {
	static get styles() {
		return [ heading4Styles, css`
		:host {
			display: block;
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
		const lengthOfLine = 115; // found by approximating the half the perimeter of the ellipse with radii 38 and 35
		const progressFill = this.value / this.max * lengthOfLine;
		return html `
			<svg viewBox="-5 -47 86 52" width="86" height="52">
				<path class="d2l-meter-radial-full-bar" d="M0,0 a 38 35 0 0 1 76 0" />
				<path
					class="d2l-meter-radial-progress-bar"
					d="M0,0 a 38 35 0 0 1 76 0"
					stroke-dasharray="${progressFill} ${lengthOfLine}"
					visibility="${this.value ? 'visible' : 'hidden'}" />
				<text class="d2l-heading-4 d2l-meter-radial-text" x="38" y="2" text-anchor="middle">${this.value}/${this.max}</text>
			</svg>
		`;
	}

	static get properties() {
		return {
			value: { type: Number, reflect: true },
			max: { type: Number, reflect: true }
		};
	}
}

customElements.define('d2l-meter-radial', MeterRadial);
