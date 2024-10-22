import { css, html, LitElement, nothing } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { MeterMixin } from './meter-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A horizontal progress bar.
 */
class MeterLinear extends MeterMixin(RtlMixin(LitElement)) {
	static get properties() {
		return {
			/**
			 * Keeps the meter to a single line
			 * @type {boolean}
			 */
			textInline: { type: Boolean, attribute: 'text-inline', reflect: true }
		};
	}
	static get styles() {
		return [bodySmallStyles, css`
			:host {
				display: block;
				position: relative;
			}

			:host > div {
				display: flex;
				flex-direction: column;
				gap: 0.45rem;
			}

			:host([text-inline]) > div {
				align-items: center;
				flex-direction: row;
			}

			.d2l-meter-linear-full-bar,
			.d2l-meter-linear-inner-bar {
				border-radius: 0.225rem;
				flex-grow: 1;
				flex-shrink: 1;
				height: 0.45rem;
			}

			.d2l-meter-linear-full-bar {
				background-color: var(--d2l-color-gypsum);
				position: relative;
			}

			:host([foreground-light]) .d2l-meter-linear-full-bar {
				background-color: rgba(255, 255, 255, 0.5);
			}

			.d2l-meter-linear-inner-bar {
				background-color: var(--d2l-color-celestine);
				inset-inline-start: 0;
				max-width: 100%;
				position: absolute;
				top: 0;
			}
			:host([foreground-light]) .d2l-meter-linear-inner-bar {
				background-color: white;
			}

			.d2l-meter-linear-text {
				color: var(--d2l-color-ferrite);
				display: flex;
				flex-direction: row;
				gap: 0.45rem;
				line-height: 1em;
				width: 100%;
			}
			:host([foreground-light]) .d2l-meter-linear-text {
				color: white;
			}
			:host([text-inline]) .d2l-meter-linear-text {
				width: auto;
			}

			.d2l-meter-linear-text-space-between {
				justify-content: space-between;
			}

			.d2l-meter-linear-secondary {
				align-self: flex-end;
			}

			:host([dir="rtl"]) .d2l-meter-linear-primary-ltr {
				direction: ltr;
			}
		`];
	}

	constructor() {
		super();
		this.textInline = false;
	}

	render() {
		let percentage = this.max > 0 ? this.value / this.max * 100 : 0;
		if (percentage < 0.5) {
			percentage = 0;
		}
		const primary = this._primary(this.value, this.max);
		const secondary = this._secondary(this.value, this.max, this.text);
		const primaryAria = this._primary(this.value, this.max, true);
		const secondaryAria = this._secondary(this.value, this.max, this.text, true);
		const textClasses = {
			'd2l-meter-linear-text-space-between': !this.textInline && secondary !== this.text,
			'd2l-body-small': true,
			'd2l-meter-linear-text': true
		};
		const primaryTextClasses = {
			'd2l-meter-linear-primary-ltr': !this.percent,
			'd2l-meter-linear-primary': true
		};
		const secondaryTextElement = secondary && !this.textHidden
			? html`<div class="d2l-meter-linear-secondary">${secondary}</div>`
			: nothing;

		return html `
			<div
				role="img"
				aria-label="${this._ariaLabel(primaryAria, secondaryAria)}">
				<div class="d2l-meter-linear-full-bar">
					<div class="d2l-meter-linear-inner-bar" style="width:${percentage}%;"></div>
				</div>
				<div class=${classMap(textClasses)}>
					<div class=${classMap(primaryTextClasses)}>${primary}</div>
					${secondaryTextElement}
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-meter-linear', MeterLinear);
