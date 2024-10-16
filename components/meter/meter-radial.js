import '../colors/colors.js';
import { bodySmallStyles, heading4Styles } from '../typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { MeterMixin } from './meter-mixin.js';
import { meterStyles } from './meter-styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A half-circle progress indicator.
 */
class MeterRadial extends MeterMixin(RtlMixin(LitElement)) {
	static get styles() {
		return [ heading4Styles, bodySmallStyles, meterStyles, css`
		:host {
			display: inline-block;
			width: 4.2rem;
		}
		.d2l-meter-full-bar,
		.d2l-meter-progress-bar {
			stroke-width: 9;
		}
	` ];
	}

	render() {
		const lengthOfLine = 115; // found by approximating half the perimeter of the ellipse with radii 38 and 35
		const percent = this.max > 0 ? (this.value / this.max) : 0;
		const visibility = (percent < 0.005) ? 'hidden' : 'visible';
		const progressFill = percent * lengthOfLine;
		const primary = this._primary(this.value, this.max);
		const secondary = this._secondary(this.value, this.max, this.text);
		const primaryAria = this._primary(this.value, this.max, true) || '';
		const secondaryAria = this._secondary(this.value, this.max, this.text, true) || '';
		const secondaryTextElement = this.text && !this.textHidden
			? html`<div class="d2l-body-small d2l-meter-text">${secondary}</div>` 
			: nothing;
		const textClasses = {
			'd2l-meter-text-ltr': !this.percent,
			'd2l-heading-4': true,
			'd2l-meter-text': true
		};

		return html `
			<div
				class="d2l-meter-container"
				role="img"
				aria-label="${this._ariaLabel(primaryAria, secondaryAria)}">
				<svg viewBox="0 0 84 46">
					<path class="d2l-meter-full-bar" d="M5 40a37 35 0 0 1 74 0" />
					<path
						class="d2l-meter-progress-bar"
						d="M5 40a37 35 0 0 1 74 0"
						stroke-dasharray="${progressFill} ${lengthOfLine}"
						stroke-dashoffset="0"
						visibility="${visibility}" />
					<text class=${classMap(textClasses)} x="38" y="2" text-anchor="middle"  transform="translate(5 39)">
						${primary}
					</text>
				</svg>
				${secondaryTextElement}
			</div>
		`;
	}
}

customElements.define('d2l-meter-radial', MeterRadial);
