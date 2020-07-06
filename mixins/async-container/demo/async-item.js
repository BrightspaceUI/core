import '../../../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { InitialStateError, runAsync } from '../../../directives/run-async.js';

class AsyncItem extends LitElement {

	static get properties() {
		return {
			delay: { type: Number },
			key: { type: String },
			throwError: { type: Boolean, attribute: 'throw-error' }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			div {
				background-color: var(--d2l-color-celestine);
				border: 1px solid var(--d2l-color-galena);
				border-radius: 0.4rem;
				color: white;
				height: 100px;
				padding: 0.3rem;
				text-align: center;
				width: 100px;
			}
		`;
	}

	constructor() {
		super();
		this.delay = 4000;
		this.key = null;
	}

	render() {
		return html`${runAsync(this.key, (key) => this._getContent(key), {
			initial: () => html`<div>init</div>`,
			pending: () => html`<div>pending</div>`,
			success: (content) => content,
			failure: (message) => html`<div title="${message}">failure</div>`
		})}`;
	}

	_getContent(key) {
		return new Promise((resolve, reject) => {
			if (!key) {
				throw new InitialStateError();
			} else {
				setTimeout(() => {
					if (this.throwError) {
						reject('an error occurred');
					} else {
						resolve(html`<div>${this.key}</div>`);
					}
				}, this.delay);
			}
		});
	}

}

customElements.define('d2l-async-demo-item', AsyncItem);
