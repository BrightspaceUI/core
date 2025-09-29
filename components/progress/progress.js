import '../../components/colors/colors.js';
import { bodyCompactStyles, bodySmallStyles } from '../typography/styles.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { formatPercent } from '@brightspace-ui/intl';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

class Progress extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * The maximum value of the progress bar
			 * @type {number}
			 */
			max: { type: Number, attribute: 'max' },
			/**
			 * The current value of the progress bar
			 * @type {number}
			 */
			value: { type: Number },
			/**
			 * Label for the progress bar
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * Hide the bar's label
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Hide the bar's value
			 * @type {boolean}
			 */
			valueHidden: { type: Boolean, attribute: 'value-hidden' },
			/**
			 * The size of the progress bar
			 * @type {'small'|'medium'|'large'}
			 */
			size: { type: String, reflect: true },
		};
	}

	static get styles() {
		return [bodySmallStyles, bodyCompactStyles, css`
				:host {
					align-items: center;
					display: flex;
					flex-wrap: wrap;
					min-width: 6rem;
				}
				:host([hidden]) {
					display: none;
				}
				:host([value-hidden]),
				:host([size="large"]) {
					row-gap: 0.3rem;
				}

				#label {
					flex: 1 0 100%;
				}

				progress {
					--d2l-progress-color: var(--d2l-color-celestine);
					-moz-appearance: none;
					-webkit-appearance: none;
					appearance: none;
					background-color: var(--d2l-color-gypsum);
					border: none;
					border-radius: 0.9rem;
					box-shadow: inset 0 2px var(--d2l-color-mica);
					display: block;
					flex: 1;
					height: 0.6rem;
					margin-right: 0.4rem;
				}
				.value {
					text-align: right;
					width: 2.42rem;
				}

				:host([size="small"]) {
					progress {
						height: 0.3rem;
						margin-right: 0.3rem;
					}

					.value {
						width: 2.15rem;
					}
				}

				:host([size="large"]) progress {
					height: 0.9rem;
					margin-right: 0.5rem;

					.value {
						width: 2.82rem;
					}
				}

				progress.complete {
					--d2l-progress-color: var(--d2l-color-olivine);
				}
				/* this is necessary to avoid white bleed over rounded corners in chrome and safari */
				progress::-webkit-progress-bar {
					background-color: transparent;
				}
			`,
		/* comma separating the selectors for these pseudo-elements causes them to break */
		/* note: unable to get firefox to animate the width... seems animation is not implemented for progress in FF */
		...['-webkit-progress-value', '-moz-progress-bar'].map(selector => css`
				progress::${unsafeCSS(selector)} {
					background-color: var(--d2l-progress-color);
					border: 1px solid transparent;
					border-radius: 0.9rem;
					transition: width 0.25s ease-out;
				}
				progress.complete::${unsafeCSS(selector)} {
					transition: none;
				}
				/* these are necessary to avoid showing border when value is 0 */
				progress[value="0"]::${unsafeCSS(selector)} {
					border: none;
				}
				@media (prefers-reduced-motion: reduce) {
					progress::${unsafeCSS(selector)} {
						transition: none;
					}
				}
			`)
		];
	}

	constructor() {
		super();
		this.labelHidden = false;
		this.max = 100;
		this.value = 0;
		this.valueHidden = false;
		this.size = 'medium';
	}

	render() {
		const classes = {
			'complete': this.value === this.max
		};
		const textClasses = {
			'd2l-body-small': this.size === 'small',
			'd2l-body-compact': this.size === 'medium'
		};
		const valueClasses = { ...textClasses, value: true };

		const percentage = Math.floor(100 * this.value / this.max) / 100;
		const perecentageText = formatPercent(percentage);

		return html`
			<div ?hidden=${this.labelHidden} id="label" class=${classMap(textClasses)}>${this.label}</div>
			<progress
				aria-labelledby="${ifDefined(this.labelHidden ? undefined : 'label')}"
				aria-label="${ifDefined(this.labelHidden ? this.label : undefined)}"
				aria-valuetext="${perecentageText}"
				class="${classMap(classes)}"
				value="${this.value}"
				max="${this.max}">
			</progress>
			<div ?hidden=${this.valueHidden} class=${classMap(valueClasses)}>${perecentageText}</div>

		`;
	}

}

customElements.define('d2l-progress', Progress);
