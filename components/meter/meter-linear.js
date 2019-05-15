import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodySmallStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

class MeterLinear extends LitElement  {
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

			.d2l-meter-linear-full-bar, .d2l-meter-linear-inner-bar {
				border-radius: 32px;
				flex-grow: 1;
				flex-shrink: 1;
				height: 9px;
				position: relative;
			}

			.d2l-meter-linear-full-bar {
				background-color: var(--d2l-color-gypsum);
				margin: 0 6px;
			}

			.d2l-meter-linear-inner-bar {
				background-color: var(--d2l-color-celestine);
				left: 0;
				position: absolute;
				top: 0;
			}

			.d2l-meter-linear-text {
				color: var(--d2l-color-ferrite);
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin: 0 6px;
			}

			.d2l-meter-linear-secondary {
				align-self: flex-end;
			}

		`];
	}

	constructor() {
		super();
		this.max = 100;
		this.percent = false;
		this.value = 0;
	}

	render() {
		const primaryTextId = getUniqueId();
		const secondaryTextId = getUniqueId();

		const percentage = this.max > 0 ? this.value / this.max * 100 : 0;
		const primary = this.percent ? `${Math.floor(percentage)}%` : `${this.value}/${this.max}`;
		const secondaryText = this._formatContext(this.text, this.value, this.max);
		const secondaryTextElement = secondaryText ? html`<div id="${secondaryTextId}" class="d2l-meter-linear-secondary">${secondaryText}</div>` : html``;
		return html `
			<div
				role="progressBar"
				aria-valuenow="${this.value}"
				aria-valuemax="${this.max}"
				aria-valuetext="${ifDefined(secondaryText)}"
				aria-describedby="${primaryTextId} ${secondaryTextId}">
				<div class="d2l-meter-linear-full-bar">
					<div class="d2l-meter-linear-inner-bar" style="width:${percentage}%;"></div>
				</div>
				<div class="d2l-body-small d2l-meter-linear-text">
					<div id="${primaryTextId}" class="d2l-meter-linear-primary">${primary}&nbsp;</div>
					${secondaryTextElement}
				</div>
			</div>
		`;
	}

	_formatContext(context, value, max) {
		if (!context) {
			return;
		}

		// Floor so you don't get 100% when you are at 99.5%
		context = context.replace('{%}', `${Math.floor(value / max * 100)}%`);
		context = context.replace('{x/y}', `${value}/${max}`);

		return context;
	}
}

customElements.define('d2l-meter-linear', MeterLinear);
