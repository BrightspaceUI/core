import '../colors/colors.js';
import { bodySmallStyles, heading4Styles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { MeterMixin } from './meter-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class MeterRadial extends MeterMixin(RtlMixin(LitElement)) {
	static get properties() {
		return {
			value: { type: Number },
			max: { type: Number },
			text: { type: String }
		};
	}

	static get styles() {
		return [ heading4Styles, bodySmallStyles, css`
		:host {
			display: inline-block;
			width: 4.3rem;
		}
		.d2l-meter-radial {
			display: flex;
			justify-content: center;
			flex-direction: column;
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
			text-align: center;
			color: var(--d2l-color-ferrite);
			fill: var(--d2l-color-ferrite);
		}
	` ];
	}

	render() {
		const lengthOfLine = 115; // found by approximating half the perimeter of the ellipse with radii 38 and 35
		const progressFill = this.value / this.max * lengthOfLine;

		const primary = this._primary(this.value, this.max);
		const secondary = this._secondary(this.value, this.max, this.text);
		const secondaryTextElement = this.text ? html`<div class="d2l-body-small d2l-meter-radial-text">${secondary}</div>` : html``;
		return html `
			<div
				class="d2l-meter-radial"
				role="img"
				aria-label="${this._ariaLabel(primary, secondary)}">
				<svg viewBox="0 0 86 52">
					<path class="d2l-meter-radial-full-bar" d="M5 47a38 35 0 0 1 76 0" />
					<path
						class="d2l-meter-radial-progress-bar"
						d="M5 47a38 35 0 0 1 76 0"
						stroke-dasharray="${progressFill} ${lengthOfLine}"
						stroke-dashoffset="${this.dir === 'rtl' ? progressFill - lengthOfLine : 0}"
						visibility="${this.value ? 'visible' : 'hidden'}" />
					<text class="d2l-heading-4 d2l-meter-radial-text" x="38" y="2" text-anchor="middle"  transform="translate(5 47)">
						${primary}
					</text>
				</svg>
				${secondaryTextElement}
			</div>
		`;
	}
}

customElements.define('d2l-meter-radial', MeterRadial);
