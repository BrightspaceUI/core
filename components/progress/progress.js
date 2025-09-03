import '../../components/colors/colors.js';
import { bodyCompactStyles, bodySmallStyles } from '../typography/styles.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { formatPercent } from '@brightspace-ui/intl';
import { getSeparator } from '@brightspace-ui/intl/lib/list.js';
import { ifDefined } from 'lit/directives/if-defined.js';

class Progress extends LitElement {

	static get properties() {
		return {
			max: { type: Number, attribute: 'max' },
			value: { type: Number },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			valueHidden: { type: Boolean, attribute: 'value-hidden' },
			small: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [bodySmallStyles, bodyCompactStyles, css`
				:host {
					display: block;
					min-width: 6rem;
				}
				:host([hidden]),
				.text[hidden] {
					display: none;
				}
				.text {
					display: flex;
					justify-content: space-between;
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
					height: 0.9rem;
					width: 100%;
				}
				:host([small]) progress {
					height: 0.6rem;
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
	}

	render() {
		const classes = {
			'complete': this.value === this.max
		};
		const textClasses = {
			'text': true,
			'd2l-body-small': this.small,
			'd2l-body-compact': !this.small
		};

		const percentage = Math.floor(100 * this.value / this.max) / 100;
		const perecentageText = formatPercent(percentage);

		return html`
			<div class=${classMap(textClasses)} ?hidden=${(this.labelHidden || !this.label) && this.valueHidden}>
				<span ?hidden=${this.labelHidden} id="label">${this.label}</span>
				<span style="font-size: 0;">${getSeparator({ nonBreaking: true })}</span>
				<span ?hidden=${this.valueHidden}>${perecentageText}</span>
			</div>
			<progress
				aria-labelledby="${ifDefined(this.labelHidden ? undefined : 'label')}"
				aria-label="${ifDefined(this.labelHidden ? this.label : undefined)}"
				aria-valuetext="${perecentageText}"
				class="${classMap(classes)}"
				value="${this.value}"
				max="${this.max}">
			</progress>
		`;
	}

}

customElements.define('d2l-progress', Progress);
