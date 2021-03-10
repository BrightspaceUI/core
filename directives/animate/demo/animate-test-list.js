import '../../../components/button/button.js';
import './animate-test-list-item.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { hide, show } from '../animate.js';

export class AnimateTestList extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
				max-width: 400px;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this._counter = 3;
		this._items = [
			{ number: 1, state: 'existing' },
			{ number: 2, state: 'existing' },
			{ number: 3, state: 'existing' }
		];
	}

	render() {
		return this._items.map((item) => {
			let animateAction = undefined;
			let showItem = false;
			if (item.state === 'remove') {
				item.state = 'removed';
				animateAction = hide();
				showItem = true;
			} else if (item.state === 'new') {
				item.state = 'existing';
				animateAction = show();
				showItem = true;
			} else if (item.state === 'existing') {
				showItem = true;
			}
			return showItem ? html`<d2l-animate-test-list-item
				.animate="${animateAction}"
				number="${item.number}"
				@d2l-animate-test-list-item-remove="${this._handleRemove}"></d2l-animate-test-list-item>` : null;
		});
	}

	addItem() {
		this._counter++;
		this._items.push({ number: this._counter, state: 'new' });
		this.requestUpdate();
	}

	_handleRemove(e) {
		const removeItem = this._items.find(item => item.number === e.target.number);
		if (removeItem) {
			removeItem.state = 'remove';
			this.requestUpdate();
		}
	}

}

customElements.define('d2l-animate-test-list', AnimateTestList);
