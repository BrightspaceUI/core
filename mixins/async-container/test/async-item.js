import '../../../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { InitialStateError, runAsync } from '../../../directives/run-async.js';

class AsyncItem extends LitElement {

	static get properties() {
		return { key: { type: String } };
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
				padding: 0.3rem;
				width: 50px;
				height: 50px;
				text-align: center;
			}
		`;
	}

	constructor() {
		super();
		this.key = null;
	}

	reject() {
		setTimeout(() => this._reject('error'), 0);
	}

	render() {
		return html`${runAsync(this.key, (key) => this._getContent(key), {
			initial: () => html`<div>init</div>`,
			pending: () => html`<div>pending</div>`,
			success: (content) => content,
			failure: () => html`<div>failure</div>`
		})}`;
	}

	resolve() {
		setTimeout(() => this._resolve(html`<div>${this.key}</div>`), 0);
	}

	_getContent(key) {
		return new Promise((resolve, reject) => {
			if (!key) throw new InitialStateError();
			this._resolve = resolve;
			this._reject = reject;
		});
	}

}

customElements.define('d2l-async-test-item', AsyncItem);
