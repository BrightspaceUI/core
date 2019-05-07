import { html, LitElement } from 'lit-element/lit-element.js';
import { meterStyles } from './meter-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class MeterLinear extends RtlMixin(LitElement)  {
	static get styles() {
		return [ meterStyles ];
	}

	render() {
		return html `
			<svg class="loadingBar" viewBox="-5 -4.5 ${this.width} 9" width="${this.width}">
				<path class="full-bar" d="M0,0 h ${this._actualWidth}" />
				<path class="progress-bar" d="M0,0 h ${this._computeProgressBarWidth(this.units, this.outOf, this._actualWidth)}" visibility="${this.units ? 'visable' : 'hidden'}"/>
			</svg>
		`;
	}

	static get properties() {
		return {
			units: { type: Number, reflect: true },
			outOf: { type: Number, reflect: true, attribute: 'out-of' },
			primary: { type: String, reflect: true },
			secondary: { type: String, reflect: true },
			width: { type: Number },
			_actualWidth: { type: Number }
		};
	}

	constructor() {
		super();
		this._width;
		this._actualWidth;
		this.units = 0;
		this.outOf = 100;
		this.width = 150;
	}

	set width(value) {
		const oldValue = this.width;
		this._actualWidth = value - 10;
		this._width = value;
		this.requestUpdate('width', oldValue);
	}

	get width() { return this._width; }

	_computeProgressBarWidth(units, outOf, actualWidth) {
		return units / outOf * actualWidth;
	}
}

customElements.define('d2l-meter-linear', MeterLinear);
