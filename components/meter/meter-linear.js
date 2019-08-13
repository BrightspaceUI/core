import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodySmallStyles } from '../typography/styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { MeterMixin } from './meter-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class MeterLinear extends MeterMixin(RtlMixin(LitElement)) {
	static get properties() {
		return {
			max: { type: Number },
			percent: { type: Boolean },
			text: { type: String },
			textInline: { type: Boolean, attribute: 'text-inline', reflect: true },
			value: { type: Number }
		};
	}
	static get styles() {
		return [
			bodySmallStyles,
			css`
			:host {
				display: block;
				position: relative;
			}

			:host > div  {
				display: block;
			}

			:host([text-inline]) > div  {
				align-items: center;
				display: flex;
				flex-direction: row;
			}

			:host([text-inline]) .d2l-meter-linear-full-bar  {
				margin-bottom: 0;
				margin-left: 0;
				margin-right: .45rem;
			}
			:host([dir="rtl"][text-inline]) .d2l-meter-linear-full-bar  {
				margin-left: .45rem;
				margin-right: 0;
			}

			.d2l-meter-linear-full-bar,
			.d2l-meter-linear-inner-bar {
				border-radius: .225rem;
				flex-grow: 1;
				flex-shrink: 1;
				height: .45rem;
			}

			.d2l-meter-linear-full-bar {
				position: relative;
				background-color: var(--d2l-color-gypsum);
				margin-bottom: 0.45rem;
			}

			.d2l-meter-linear-inner-bar {
				position: absolute;
				left: 0;
				top: 0;
				background-color: var(--d2l-color-celestine);
			}
			:host([dir="rtl"]) .d2l-meter-linear-inner-bar {
				right: 0;
			}

			.d2l-meter-linear-text {
				color: var(--d2l-color-ferrite);
				display: flex;
				flex-direction: row;
				line-height: 1em;
			}

			.d2l-meter-linear-text-space-between {
				justify-content: space-between;
			}

			.d2l-meter-linear-secondary {
				align-self: flex-end;
			}

		`];
	}

	render() {
		const percentage = this.max > 0 ? this.value / this.max * 100 : 0;
		const primary = this._primary(this.value, this.max, this.dir);
		const secondary = this._secondary(this.value, this.max, this.text);
		const textClasses =  {
			'd2l-meter-linear-text-space-between': !this.textInline && secondary !== this.text,
			'd2l-body-small': true,
			'd2l-meter-linear-text': true
		};
		const secondaryTextElement = secondary ? html`<div class="d2l-meter-linear-secondary">${secondary}</div>` : html``;

		return html `
			<div
				role="img"
				aria-label="${this._ariaLabel(primary, secondary)}">
				<div class="d2l-meter-linear-full-bar">
					<div class="d2l-meter-linear-inner-bar" style="width:${percentage}%;"></div>
				</div>
				<div class=${classMap(textClasses)}>
					<div class="d2l-meter-linear-primary">${primary}&nbsp;</div>
					${secondaryTextElement}
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-meter-linear', MeterLinear);
