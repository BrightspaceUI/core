import '../../switch/switch.js';
import '../../button/button-subtle.js';
import '../../collapsible-panel/collapsible-panel.js';
import '../../collapsible-panel/collapsible-panel-group.js';
import { css, html, LitElement } from 'lit';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

class SkeletonTestGroup extends LitElement {
	static get properties() {
		return {
			_loadAsGroup: { state: true },
		};
	}
	static get styles() {
		return [css`
			:host {
				display: block;
			}

			.controls {
				align-items: center;
				display: flex;
				gap: 0.6rem;
				justify-content: space-between;
				margin-bottom: 0.6rem;
			}
		`];
	}

	render() {
		return html`
			<div class="controls">
				<d2l-button-subtle @click="${this._loadItems}" text="Load items" icon="tier1:download"></d2l-button-subtle>
				<d2l-switch @click="${this._toggleLoadType}" text="Wait for all elements to load" ?on="${this._loadAsGroup}"></d2l-switch>
			</div>

			${this._loadAsGroup ? this._renderGroup() : this._renderIndividual() }
		`;
	}

	_loadItems() {
		const ids = ['1', '2', '3'];
		ids.forEach(id => this.shadowRoot.getElementById(id).skeleton = true);
		ids.forEach(id =>  setTimeout(() => { this.shadowRoot.getElementById(id).skeleton = false; }, Math.random() * 2000));
	}

	_renderContents() {
		return html`
			<d2l-collapsible-panel-group>
				<d2l-collapsible-panel skeleton id="1" panel-title="Item 1">Contents</d2l-collapsible-panel>
				<d2l-collapsible-panel skeleton id="2" panel-title="Item 2">Contents</d2l-collapsible-panel>
				<d2l-collapsible-panel skeleton id="3" panel-title="Item 3">Contents</d2l-collapsible-panel>
			</d2l-collapsible-panel-group>
		`;
	}

	_renderGroup() {
		return html`<d2l-test-skeleton-group-on>${this._renderContents()}</d2l-test-skeleton-group-on>`;
	}

	_renderIndividual() {
		return html`<d2l-test-skeleton-group-off>${this._renderContents()}</d2l-test-skeleton-group-off>`;
	}

	_reset() {
	}

	_toggleLoadType() {
		this._loadAsGroup = !this._loadAsGroup;
	}
}
customElements.define('d2l-test-skeleton-group', SkeletonTestGroup);

class SkeletonTestGroupOff extends LitElement {
	render() { return html`<slot></slot>`; }
}
customElements.define('d2l-test-skeleton-group-off', SkeletonTestGroupOff);

class SkeletonTestGroupOn extends SkeletonGroupMixin(LitElement) {
	render() { return html`<slot></slot>`; }
}
customElements.define('d2l-test-skeleton-group-on', SkeletonTestGroupOn);

