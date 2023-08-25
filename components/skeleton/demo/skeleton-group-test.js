import '../../switch/switch.js';
import '../../button/button-subtle.js';
import './skeleton-test-container.js';
import { css, html, LitElement } from 'lit';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

class SkeletonTestGroup extends LitElement {
	static get properties() {
		return {
			_items: { state: true },
			_loadAsGroup: { state: true },
		};
	}
	static get styles() {
		return css`
			.controls {
				align-items: center;
				display: flex;
				gap: 0.6rem;
				justify-content: space-between;
				margin-bottom: 0.6rem;
			}
			d2l-test-skeleton-container {
				margin-bottom: 0.6rem;
			}
		`;
	}

	constructor() {
		super();
		this._items = [1, 2, 3];
		this._loadAsGroup = true;
	}

	render() {
		return html`
			<div class="controls">
				<div>
					<d2l-button-subtle @click="${this._loadItems}" text="Load items" icon="tier1:download"></d2l-button-subtle>
					<d2l-button-subtle @click="${this._addItem}" text="Add item" icon="tier1:add"></d2l-button-subtle>
					<d2l-button-subtle @click="${this._removeItem}" text="Remove item" icon="tier1:delete"></d2l-button-subtle>
				</div>
				<d2l-switch @click="${this._toggleLoadType}" text="Wait for all elements to load" ?on="${this._loadAsGroup}"></d2l-switch>
			</div>

			${this._loadAsGroup ? this._renderGroup() : this._renderIndividual() }
		`;
	}

	_addItem() {
		this._items.push((this._items.length + 1));
		this.requestUpdate();
	}

	_loadItems() {
		this._items.forEach(id => {
			const item = this.shadowRoot.getElementById(id);
			item.skeleton = true;
			setTimeout(() => item.skeleton = false, Math.random() * 2000);
		});
	}

	_removeItem() {
		this._items.pop();
		this.requestUpdate();
	}

	_renderContents() {
		return html`
			${this._items.map(item => html`<d2l-test-skeleton-container skeleton id="${item}"></d2l-test-skeleton-container>`)}
		`;
	}

	_renderGroup() {
		return html`<d2l-test-skeleton-group-on>${this._renderContents()}</d2l-test-skeleton-group-on>`;
	}

	_renderIndividual() {
		return html`<div class="panels">${this._renderContents()}</div>`;
	}

	_toggleLoadType() {
		this._loadAsGroup = !this._loadAsGroup;
	}
}
customElements.define('d2l-test-skeleton-group', SkeletonTestGroup);

class SkeletonTestGroupOn extends SkeletonGroupMixin(LitElement) {
	render() { return html`<slot></slot>`; }
}
customElements.define('d2l-test-skeleton-group-on', SkeletonTestGroupOn);
