import '../../switch/switch.js';
import '../../button/button-subtle.js';
import '../../collapsible-panel/collapsible-panel.js';
import '../../collapsible-panel/collapsible-panel-group.js';
import '../../inputs/input-checkbox.js';
import '../../inputs/input-text.js';
import '../../list/list.js';
import '../../list/list-item.js';
import { css, html, LitElement } from 'lit';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

class SkeletonTestNestedGroup extends SkeletonGroupMixin(LitElement) {
	static get properties() {
		return {
			_skeletonList: { state: true },
			_skeletonInput: { state: true },
		};
	}
	static get styles() {
		return css`
			.controls {
				align-items: center;
				display: flex;
				gap: 0.6rem;
				margin-bottom: 0.6rem;
			}
			d2l-input-text,
			d2l-list {
				margin-bottom: 0.6rem;
			}
		`;
	}

	constructor() {
		super();
		this._skeletonList = false;
		this._skeletonInput = false;
	}

	render() {
		return html`
			<div class="controls">
				<d2l-switch @click="${this._loadList}" ?on="${this._skeletonList}" text="d2l-list skeleton"></d2l-switch>
				<d2l-switch @click="${this._loadInput}" ?on="${this._skeletonInput}" text="d2l-input skeleton"></d2l-switch>
			</div>
			<d2l-list ?skeleton="${this._skeletonList}">
				<d2l-list-item>
					<d2l-list-item-content>
						<d2l-input-text label="Label" ?skeleton="${this._skeletonInput}"></d2l-input-text>
						<d2l-input-checkbox>Item</d2l-input-checkbox>
						<d2l-input-checkbox>Item</d2l-input-checkbox>
					</d2l-list-item-content>
				</d2l-list-item>
			</d2l-list>
			<d2l-collapsible-panel-group>
				<d2l-collapsible-panel panel-title="Title"></d2l-collapsible-panel>
				<d2l-collapsible-panel panel-title="Title"></d2l-collapsible-panel>
			</d2l-collapsible-panel-group>
		`;
	}

	_loadInput() {
		this._skeletonInput = !this._skeletonInput;
	}

	_loadList() {
		this._skeletonList = !this._skeletonList;
	}
}
customElements.define('d2l-test-nested-skeleton-group', SkeletonTestNestedGroup);

