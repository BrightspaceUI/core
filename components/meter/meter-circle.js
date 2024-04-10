import '../colors/colors.js';
import { bodySmallStyles } from '../typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { bodyStandardStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { MeterMixin } from './meter-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A circular progress indicator.
 */
class MeterCircle extends MeterMixin(RtlMixin(LitElement)) {
	static get styles() {
		return [ bodySmallStyles, bodyStandardStyles, css`
		:host {
			display: inline-block;
			width: 2.4rem;
		}
		:host([text]:not([text-hidden])) {
			width: fit-content;
		}
		.d2l-meter-circle {
			display: flex;
			flex-direction: column;
			justify-content: center;
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
		.d2l-meter-circle-text-secondary {
			color: var(--d2l-color-ferrite);
			font-size: 0.6rem;
			text-align: center;
		}
		:host([foreground-light]) .d2l-meter-circle-text-secondary {
			color: white;
		}
		:host([dir="rtl"]) .d2l-meter-circle-text-ltr {
			direction: ltr;
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
		const secondary = this._secondary(this.value, this.max, this.text);
		const secondaryTextElement = (this.text && !this.textHidden) ? html`<div class="d2l-body-small d2l-meter-circle-text-secondary">${secondary}</div>` : nothing;
		const textClasses = {
			'd2l-meter-circle-text-ltr': !this.percent,
			'd2l-body-standard': true,
			'd2l-meter-circle-text': true
		};

		return html`
			<div
				class="${(this.text && !this.textHidden) ? 'fit-content ' : ''}d2l-meter-circle"
				role="img"
				aria-label="${this._ariaLabel(primary, secondary)}">
				<svg viewBox="0 0 48 48" shape-rendering="geometricPrecision" role="img">
					<circle class="d2l-meter-circle-full-bar" cx="24" cy="24" r="21"></circle>
					<circle
						class="d2l-meter-circle-progress-bar"
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
