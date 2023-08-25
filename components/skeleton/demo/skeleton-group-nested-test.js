import '../../switch/switch.js';
import './skeleton-group-test-wrapper.js';
import './skeleton-test-box.js';
import './skeleton-test-container.js';
import './skeleton-test-heading.js';

import { css, html, LitElement } from 'lit';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

class SkeletonTestNestedGroup extends SkeletonGroupMixin(LitElement) {
	static get properties() {
		return {
			_skeletonParent: { state: true },
			_skeletonContainer: { state: true },
			_skeletonHeading: { state: true },
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
		`;
	}

	constructor() {
		super();
		this._skeletonParent = false;
		this._skeletonContainer = false;
		this._skeletonHeading = false;
	}

	render() {
		return html`
			<div class="controls">
				<d2l-switch @click="${this._loadGroup}" ?on="${this._skeletonSetExplicitly}" text="parent skeleton"></d2l-switch>
				<d2l-switch @click="${this._loadList}" ?on="${this._skeletonContainer}" text="container skeleton"></d2l-switch>
				<d2l-switch @click="${this._loadInput}" ?on="${this._skeletonHeading}" text="heading skeleton"></d2l-switch>
			</div>
			<d2l-skeleton-group-test-wrapper>
				<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
				<d2l-skeleton-group-test-wrapper ?skeleton="${this._skeletonContainer}">
					<d2l-test-skeleton-heading level="3" ?skeleton="${this._skeletonHeading}">Inner heading</d2l-test-skeleton-heading>
					<d2l-test-skeleton-box></d2l-test-skeleton-box>
				</d2l-skeleton-group-test-wrapper>
				<d2l-skeleton-group-test-wrapper>
					<d2l-test-skeleton-heading level="3">Heading 3</d2l-test-skeleton-heading>
					<d2l-test-skeleton-container></d2l-test-skeleton-container>
				</d2l-skeleton-group-test-wrapper>
			</d2l-skeleton-group-test-wrapper>
		`;
	}

	_loadGroup() {
		this._skeletonParent = !this._skeletonParent;
		this.skeleton = this._skeletonParent;
	}

	_loadInput() {
		this._skeletonHeading = !this._skeletonHeading;
	}

	_loadList() {
		this._skeletonContainer = !this._skeletonContainer;
	}
}
customElements.define('d2l-test-nested-skeleton-group', SkeletonTestNestedGroup);

