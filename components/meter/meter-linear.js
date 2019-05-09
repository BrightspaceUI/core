import { css, html, LitElement } from 'lit-element/lit-element.js';

class MeterLinear extends LitElement  {
	static get properties() {
		return {
			value: { type: Number },
			max: { type: Number },
			primary: { type: String },
			secondary: { type: String }
		};
	}
	static get styles() {
		return [ css`
			:host {
				display: block;
				position: relative;
			}

			.d2l-meter-linear-full-bar, .d2l-meter-linear-inner-bar {
				border-radius: 32px;
				height: 9px;
				width: 100%;
			}

			.d2l-meter-linear-full-bar {
				background-color: var(--d2l-color-gypsum);
			}

			.d2l-meter-linear-inner-bar {
				background-color: var(--d2l-color-celestine);
				left: 0;
				position: absolute;
				top: 0;
			}
		`];
	}

	constructor() {
		super();
		this.value = 0;
		this.max = 100;
	}

	render() {
		const progressBarWidth = this.value / this.max * 100;
		return html `
			<div class="d2l-meter-linear-full-bar">
				<div class="d2l-meter-linear-inner-bar" style="width:${progressBarWidth}%;"></div>
			</div>
		`;
	}
}

customElements.define('d2l-meter-linear', MeterLinear);
