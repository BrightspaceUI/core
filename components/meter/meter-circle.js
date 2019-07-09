import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';
import { MeterMixin } from './meter-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class MeterCircle extends MeterMixin(RtlMixin(LitElement)) {
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
		}
	` ];
	}

	render() {
		const lengthOfLine = 21 * Math.PI * 2; // approximation perimeter of circle
		const progressFill = this.value / this.max * lengthOfLine;
		const space = lengthOfLine - progressFill;
		const dashOffset = this.dir === 'rtl' ? 7 * Math.PI + 10 - space : 7 * Math.PI * 2 - 10; // approximation perimeter of circle divide by 3 subtract the rounded edges (5 pixels each)

		const primary = this._primary(this.value, this.max) || '';
		const secondary = this._secondary(this.value, this.max, this.text);

		return html`
			<svg viewBox="0 0 48 48" shape-rendering="geometricPrecision" role="img" aria-label="${this._ariaLabel(primary, secondary)}">
				<circle class="d2l-meter-circle-full-bar" cx="24" cy="24" r="21"></circle>
				<circle
					class="d2l-meter-circle-progress-bar"
					cx="24" cy="24" r="21"
					stroke-dasharray="${progressFill} ${space}"
					stroke-dashoffset="${dashOffset}"
					visibility="${this.value ? 'visible' : 'hidden'}"></circle>

				<text class="d2l-body-standard d2l-meter-circle-text" x="24" y="28" text-anchor="middle">
					${primary.split(' ').join('')}
				</text>
			</svg>
		`;
	}
}

customElements.define('d2l-meter-circle', MeterCircle);
