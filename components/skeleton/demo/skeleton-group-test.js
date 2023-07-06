import '../../colors/colors.js';
import '../../switch/switch.js';
import '../../collapsible-panel/collapsible-panel.js';
import '../../collapsible-panel/collapsible-panel-group.js';
import { css, html, LitElement } from 'lit';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

class SkeletonTestGroup extends SkeletonGroupMixin(LitElement) {

	static get styles() {
		return [
			css`
				:host {
					display: block;
				}

				d2l-switch {
					margin-bottom: 1rem;
				}
			`
		];
	}

	render() {
		return html`
			<d2l-switch @click="${this._loadItem}" text="1" data-item="1"></d2l-switch>
			<d2l-switch @click="${this._loadItem}" text="2" data-item="2"></d2l-switch>
			<d2l-switch @click="${this._loadItem}" text="3" data-item="3"></d2l-switch>

				<d2l-collapsible-panel-group>
					<d2l-collapsible-panel id="1" skeleton panel-title="Item 1">
						panel content
					</d2l-collapsible-panel>

					<d2l-collapsible-panel id="2" skeleton panel-title="Item 2">
						panel content
					</d2l-collapsible-panel>
					<d2l-collapsible-panel id="3" skeleton panel-title="Item 3">
						panel content
					</d2l-collapsible-panel>
				</d2l-collapsible-panel-group>

		`;
	}

	_loadItem(e) {
		const id = e.target.getAttribute('data-item');
		const el = this.shadowRoot.getElementById(id);
		el.skeleton = !el.skeleton;
	}
}

customElements.define('d2l-test-skeleton-group', SkeletonTestGroup);
