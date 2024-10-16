import '../colors/colors.js';
import { bodySmallStyles, bodyStandardStyles } from '../typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { MeterMixin } from './meter-mixin.js';
import { meterStyles } from './meter-styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A circular progress indicator.
 */
class MeterCircle extends MeterMixin(RtlMixin(LitElement)) {
	static get styles() {
		return [ bodySmallStyles, bodyStandardStyles, meterStyles, css`
		:host {
			display: inline-block;
			width: 2.4rem;
		}
		.d2l-meter-full-bar,
		.d2l-meter-progress-bar {
			stroke-width: 6;
		}
		.d2l-meter-full-bar {
			fill: var(--d2l-meter-circle-fill, none);
		}
		.d2l-meter-text {
			font-size: 0.55rem;
		}
	` ];
	}

	render() {
		const lengthOfLine = 21 * Math.PI * 2; // approximation perimeter of circle
		const percent = this.max > 0 ? (this.value / this.max) : 0;
		const visibility = (percent < 0.005) ? 'hidden' : 'visible';
		const progressFill = percent * lengthOfLine;
		const space = lengthOfLine - progressFill;
		const dashOffset = 7 * Math.PI * 2 - 10; // approximation perimeter of circle divide by 3 subtract the rounded edges (5 pixels each)

		const primary = this._primary(this.value, this.max) || '';
		const primaryAria = this._primary(this.value, this.max, true) || '';
		const secondaryAria = this._secondary(this.value, this.max, this.text, true);
		const secondary = this._secondary(this.value, this.max, this.text);
		const secondaryTextElement = this.text && !this.textHidden
			? html`<div class="d2l-body-small d2l-meter-text">${secondary}</div>`
			: nothing;
		const textClasses = {
			'd2l-meter-text-ltr': !this.percent,
			'd2l-body-standard': true,
			'd2l-meter-text': true
		};

		return html`
			<div class="d2l-meter-container" aria-label="${this._ariaLabel(primaryAria, secondaryAria)}" role="img">
				<svg viewBox="0 0 48 48" shape-rendering="geometricPrecision">
					<circle class="d2l-meter-full-bar" cx="24" cy="24" r="21"></circle>
					<circle
						class="d2l-meter-progress-bar"
						cx="24" cy="24" r="21"
						stroke-dasharray="${progressFill} ${space}"
						stroke-dashoffset="${dashOffset}"
						visibility="${visibility}"></circle>

					<text class=${classMap(textClasses)} x="24" y="28" text-anchor="middle">
						${primary}
					</text>
				</svg>
				${secondaryTextElement}
			</div>
		`;
	}
}

customElements.define('d2l-meter-circle', MeterCircle);
