import '../../components/colors/colors.js';
import { bodyCompactStyles, bodySmallStyles } from '../typography/styles.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
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
			value: { type: Number, reflect: true },
			/**
			 * REQUIRED: Label for the progress bar
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * Hide the bar's label
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Announce the label when it changes
			 * @type {boolean}
			 */
			announceLabel: { type: Boolean, attribute: 'announce-label' },
			/**
			 * Hide the bar's value
			 * @type {boolean}
			 */
			valueHidden: { type: Boolean, attribute: 'value-hidden', reflect: true },
			/**
			 * The size of the progress bar
			 * @type {'small'|'medium'|'large'}
			 */
			size: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [bodySmallStyles, bodyCompactStyles, css`
				:host {
					align-items: center;
					display: grid;
					grid-template: auto auto / 1fr auto;
					grid-template-areas:
						"label label"
						"bar value";
					min-width: 6rem;
				}
				:host([hidden]) {
					display: none;
				}

				#label {
					grid-area: label;
					width: 100%;
				}

				progress {
					--d2l-progress-color: var(--d2l-color-celestine);
					-moz-appearance: none;
					-webkit-appearance: none;
					appearance: none;
					background-color: var(--d2l-color-gypsum);
					box-shadow: inset 0 2px var(--d2l-color-mica);
					width: 100%;
				}
				.bar {
					border: none;
					border-radius: 0.9rem;
					display: block;
					grid-area: bar;
					height: 0.6rem;
				}
				.value {
					grid-area: value;
					margin-inline-start: 0.4rem;
					text-align: end;
					width: 2.42rem;
				}

				:host([size="small"]) {
					.bar {
						height: 0.3rem;
					}

					.value {
						margin-inline-start: 0.3rem;
						width: 2.15rem;
					}
				}

				:host([size="large"]) {
					line-height: 1.5rem;
					.bar {
						height: 0.9rem;
					}
					.value {
						margin-inline-start: 0.5rem;
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


				:host(:not([value-hidden]):not([value])) .bar {
					margin-bottom: 0.3rem;
				}

				:host(:not([value]):not([label-hidden])),
				:host([value-hidden]:not([label-hidden])) {
					row-gap: 0.3rem;
				}

				.indeterminate-bar-container {
					overflow: hidden;
				}
				.indeterminate-bar {
					--d2l-progress-indeterminate-width: calc(100% / 3);
					animation: 1450ms 50ms ease-in-out indeterminateState alternate infinite;
					background-color: var(--d2l-color-celestine);
					height: 100%;
					margin-inline-start: calc(var(--d2l-progress-indeterminate-width) * -0.75);
					width: var(--d2l-progress-indeterminate-width);
				}
				@keyframes indeterminateState {
					100% {
						margin-inline-start: calc(100% - var(--d2l-progress-indeterminate-width) * 0.25);
					}
				}
			`,
		/* comma separating the selectors for these pseudo-elements causes them to break */
		/* note: unable to get firefox to animate the width... seems animation is not implemented for progress in FF */
		...['-webkit-progress-value', '-moz-progress-bar'].map(selector => css`
				progress::${unsafeCSS(selector)} {
					background-color: var(--d2l-progress-color);
					border: 1px solid transparent;
					border-radius: 0.9rem;
					transition: width 0.4s ease-out;
				}
				/* these are necessary to avoid showing border when value is 0 */
				progress:not([value])::${unsafeCSS(selector)},
				progress[value="0"]::${unsafeCSS(selector)} {
					border: none;
				}

				progress:not([value])::${unsafeCSS(selector)} {
					transition: none;
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
		this.announceLabel = false;
		this.labelHidden = false;
		this.max = 100;
		this.size = 'medium';
		this.valueHidden = false;
	}

	get isComplete() {
		return this.value >= this.max;
	}

	render() {
		const classes = {
			'complete': this.isComplete,
			'bar': true
		};
		const textClasses = {
			'd2l-body-small': this.size === 'small',
			'd2l-body-compact': this.size === 'medium'
		};
		const valueClasses = { ...textClasses, value: true };
		const isIndeterminate = this.value === undefined;

		const percentageText = isIndeterminate ? undefined : formatPercent(this.isComplete ? 1 : Math.floor(100 * this.value / this.max) / 100);
		return html`
			<div aria-live=${this.announceLabel ? 'polite' : 'off'} ?hidden=${this.labelHidden} id="label" class=${classMap(textClasses)}>${this.label}</div>
			<progress
				aria-labelledby="${ifDefined(this.labelHidden ? undefined : 'label')}"
				aria-label="${ifDefined(this.labelHidden ? this.label : undefined)}"
				aria-valuetext="${ifDefined(percentageText)}"
				class="${classMap(classes)}"
				value="${ifDefined(this.value)}"
				max="${this.max}">
			</progress>
			${isIndeterminate ? html`
				<div class="indeterminate-bar-container bar">
					<div class="indeterminate-bar bar"></div>
				</div>
			` : nothing}
			<div ?hidden=${this.valueHidden || isIndeterminate} class=${classMap(valueClasses)}>${percentageText}</div>
		`;
	}

}

customElements.define('d2l-progress', Progress);
