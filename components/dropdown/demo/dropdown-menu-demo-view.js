import '../../colors/colors.js';
import '../../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { HierarchicalViewMixin } from '../../hierarchical-view/hierarchical-view-mixin.js';
import { LocalizeCoreElement } from '../../../helpers/localize-core-element.js';

class DemoView extends LocalizeCoreElement(HierarchicalViewMixin(LitElement)) {

	static get styles() {
		return [ super.styles,
			css`
				:host {
					box-sizing: border-box;
					color: var(--d2l-color-ferrite);
					cursor: default;
				}
				.d2l-hierarchical-view-content {
					padding: 12px;
				}
			`
		];
	}

	render() {
		return html`
			<div class="d2l-hierarchical-view-content">
				<div>Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters.</div>
				<div>
					<d2l-button-subtle text="${this.localize('components.pager-load-more.action')}"></d2l-button-subtle>
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-dropdown-menu-demo-view', DemoView);
