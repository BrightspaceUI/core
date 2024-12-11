import { LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { TabMixin } from './tab-mixin.js';

class Tab extends TabMixin(SkeletonMixin(RtlMixin(LitElement))) {

	renderContent() {
		return html`<slot></slot>`;
	}

	render() {
		return html`
			<div class="tab-handler">
				${this.renderContent()}
			</div>
		`;
	}
}

customElements.define('d2l-tab-wip', Tab);
