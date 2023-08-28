import '../../../components/colors/colors.js';
import { css, html, LitElement } from 'lit';
import { InitialStateError, runAsync } from '../../../directives/run-async/run-async.js';

class AsyncItem extends LitElement {

	static get properties() {
		return {
			delay: { type: Number },
			key: { type: String },
			manual: { type: Boolean },
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
		this.manual = false;
	}

	render() {
		return html`${runAsync(this.key, (key) => this._getContent(key), {
			initial: () => html`<div>init</div>`,
			pending: () => html`<div>pending</div>`,
			success: (content) => content,
			failure: (message) => html`<div title="${message}">failure</div>`
		})}`;
	}

	reject() {
		setTimeout(() => this._reject('error'), 0);
	}

	resolve() {
		setTimeout(() => this._resolve(html`<div>${this.key}</div>`), 0);
	}

	_getContent(key) {
		return new Promise((resolve, reject) => {
			if (!key) {
				throw new InitialStateError();
			} else {
				this._resolve = resolve;
				this._reject = reject;
				if (!this.manual) {
					setTimeout(() => {
						if (this.throwError) {
							this.reject();
						} else {
							this.resolve();
						}
					}, this.delay);
				}
			}
		});
	}

}

customElements.define('d2l-async-demo-item', AsyncItem);
