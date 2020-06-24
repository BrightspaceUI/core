import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';
import { MeterMixin } from './meter-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A circular progress indicator.
 */
class MeterCircle extends MeterMixin(RtlMixin(LitElement)) {
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
			fill: var(--d2l-meter-circle-fill, none);
			stroke: var(--d2l-color-gypsum);
		}
		:host([foreground-light]) .d2l-meter-circle-full-bar {
			stroke: rgba(255, 255, 255, 0.5);
		}
		.d2l-meter-circle-progress-bar {
			stroke: var(--d2l-color-celestine);
		}
		:host([foreground-light]) .d2l-meter-circle-progress-bar {
			stroke: white;
		}
		.d2l-meter-circle-text {
			fill: var(--d2l-color-ferrite);
			font-size: 0.6rem;
		}
		:host([foreground-light]) .d2l-meter-circle-text {
			fill: white;
		}
	` ];
	}

	render() {
		const lengthOfLine = 21 * Math.PI * 2; // approximation perimeter of circle
		const percent = this.max > 0 ? (this.value / this.max) : 0;
		const visibility = (percent < 0.005) ? 'hidden' : 'visible';
		const progressFill = percent * lengthOfLine;
		const space = lengthOfLine - progressFill;
		const dashOffset = this.dir === 'rtl' ? 7 * Math.PI + 10 - space : 7 * Math.PI * 2 - 10; // approximation perimeter of circle divide by 3 subtract the rounded edges (5 pixels each)

		const primary = this._primary(this.value, this.max, this.dir) || '';
		const secondary = this._secondary(this.value, this.max, this.text);

		return html`
			<svg viewBox="0 0 48 48" shape-rendering="geometricPrecision" role="img" aria-label="${this._ariaLabel(primary, secondary)}">
				<circle class="d2l-meter-circle-full-bar" cx="24" cy="24" r="21"></circle>
				<circle
					class="d2l-meter-circle-progress-bar"
					cx="24" cy="24" r="21"
					stroke-dasharray="${progressFill} ${space}"
					stroke-dashoffset="${dashOffset}"
					visibility="${visibility}"></circle>

				<text class="d2l-body-standard d2l-meter-circle-text" x="24" y="28" text-anchor="middle">
					${primary}
				</text>
			</svg>
		`;
	}
}

customElements.define('d2l-meter-circle', MeterCircle);
