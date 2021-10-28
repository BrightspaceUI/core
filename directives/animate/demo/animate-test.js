import '../../../components/button/button.js';
import '../../../components/inputs/input-checkbox.js';
import '../../../components/list/list.js';
import '../../../components/list/list-item.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { hide, show } from '../animate.js';


export class AnimateTest extends LitElement {

	static get properties() {
		return {
			_listVisibility: { type: Boolean, reflect: false },
			_renderCount: { type: Number, reflect: false }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			d2l-list {
				margin-bottom: 0.9rem;
				max-width: 400px;
			}
		`;
	}

	constructor() {
		super();
		this._counter = 3;
		this._doAnimate = false;
		this._items = [
			{ number: 1, state: 'existing' },
			{ number: 2, state: 'existing' },
			{ number: 3, state: 'existing' }
		];
		this._listVisibility = true;
		this._renderCount = 0;
	}

	render() {
		const animateAction = this._listVisibility ?
			show({ skip: !this._doAnimate }) :
			hide({ skip: !this._doAnimate });
		const items = this._items.map((item) => {
			let animateAction = undefined;
			let showItem = false;
			if (item.state === 'remove') {
				item.state = 'removed';
				animateAction = hide();
				console.log("hide");
				showItem = true;
			} else if (item.state === 'new') {
				item.state = 'existing';
				animateAction = show();
				showItem = true;
			} else if (item.state === 'existing') {
				showItem = true;
			}
			return showItem ? html`<d2l-list-item .animate="${animateAction}">
					Item ${item.number}
					<d2l-button-icon slot="actions" icon="tier1:delete" text="Remove" @click="${this._handleRemove}" data-number="${item.number}"></d2l-button-icon>
				</d2l-list-item>` : null;
		});
		return html`
			<d2l-input-checkbox .checked="${this._listVisibility}" @change="${this._handleToggleList}">Show items</d2l-input-checkbox>
			<d2l-list .animate="${animateAction}">${items}</d2l-list>
			<d2l-button @click="${this._handleAddItem}" ?disabled="${!this._listVisibility}">Add Item</d2l-button>
			<d2l-button @click="${this._handleReRender}">Re-render (${this._renderCount})</d2l-button>
		`;
	}

	_handleAddItem() {
		this._counter++;
		this._items.push({ number: this._counter, state: 'new' });
		this.requestUpdate();
	}

	_handleRemove(e) {
		const removeItem = this._items.find(item => item.number === parseInt(e.target.getAttribute('data-number')));
		if (removeItem) {
			removeItem.state = 'remove';
			this.requestUpdate();
		}
	}

	_handleReRender() {
		this._renderCount++;
	}

	_handleToggleList(e) {
		this._listVisibility = e.target.checked;
		this._doAnimate = true;
	}

}

customElements.define('d2l-animate-test', AnimateTest);
