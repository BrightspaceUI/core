import '../../components/button/button.js';
import './visibility-test-item.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { VisibilityMixin } from '../visibility-mixin.js';

export class VisibilityTestList extends VisibilityMixin(LitElement) {

	static get properties() {
		return {
			_changeTracker: { type: Number, reflect: false },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				max-width: 400px;
			}
		`;
	}

	constructor() {
		super();
		this._changeTracker = 0;
		this._counter = 3;
		this._items = [
			{ number: 1, state: 'existing' },
			{ number: 2, state: 'existing' },
			{ number: 3, state: 'existing' }
		];
	}

	render() {
		return this._items.map((item) => {
			let animate = undefined;
			let showItem = false;
			if (item.state === 'remove') {
				item.state = 'removed';
				animate = 'remove';
				showItem = true;
			} else if (item.state === 'new') {
				item.state = 'existing';
				animate = 'show';
				showItem = true;
			} else if (item.state === 'existing') {
				showItem = true;
			}
			return showItem ? html`<d2l-visibility-test-item
				animate="${ifDefined(animate)}"
				number="${item.number}"
				@d2l-visibility-test-item-remove="${this._handleRemove}"></d2l-visibility-test-item>` : null;
		});
	}

	addItem() {
		this._counter++;
		this._changeTracker++;
		this._items.push({ number: this._counter, state: 'new' });
	}

	_handleRemove(e) {
		const removeItem = this._items.find(item => item.number === e.target.number);
		if (removeItem) {
			removeItem.state = 'remove';
			this._changeTracker++;
		}
	}

}

customElements.define('d2l-visibility-test-list', VisibilityTestList);
