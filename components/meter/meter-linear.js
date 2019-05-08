import { html, LitElement } from 'lit-element/lit-element.js';
import { meterStyles } from './meter-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class MeterLinear extends RtlMixin(LitElement)  {
	static get styles() {
		return [ meterStyles ];
	}

	render() {
		const barWidth = this.width - 10;
		const progressBarWidth = this.value / this.max * barWidth;
		return html `
			<svg viewBox="-5 -4.5 ${this.width} 9" width="${this.width}">
				<path class="d2l-meter-full-bar" d="M0,0 h ${barWidth}" />
				<path class="d2l-meter-progress-bar" d="M0,0 h ${progressBarWidth}" visibility="${this.value ? 'visable' : 'hidden'}"/>
			</svg>
		`;
	}

	static get properties() {
		return {
			value: { type: Number, reflect: true },
			max: { type: Number, reflect: true },
			primary: { type: String, reflect: true },
			secondary: { type: String, reflect: true },
			width: { type: Number }
		};
	}

	constructor() {
		super();
		this.value = 0;
		this.max = 100;
		this.width = 150;
	}
}

customElements.define('d2l-meter-linear', MeterLinear);
