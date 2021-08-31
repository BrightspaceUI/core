import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class CountBadge extends RtlMixin(LitElement) {

	static get properties() {
		return {
			number: {
				type: Number,
				reflect: true,
				attribute: 'number'
			}
		};
	}

	static get styles() {
		return [ css`
		`];
	}

	constructor() {
		super();
		this.number = null;
	}

	render() {
		return html`
        <div>${this.number}</div>`;
	}
}

customElements.define('d2l-count-badge', CountBadge);
