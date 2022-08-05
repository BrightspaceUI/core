import { css, LitElement } from 'lit';
import { OverflowGroupMixin } from '../overflow-group/overflow-group-mixin.js';

/**
 * A component that can be used to display a group of filters that will be put into an overflow filter when they no longer fit on the first line of their container
 * @slot - d2l-filters to be added to the container
*/
class FilterOverflowGroup extends OverflowGroupMixin(LitElement) {

	static get styles() {
		return [super.styles, css`
			::slotted(d2l-filter) {
				margin-right: 0.3rem;
			}
		`];
	}

	getOverflowContainer() {
	}

	convertToOverflowItem() {
	}

}

customElements.define('d2l-filter-overflow-group', FilterOverflowGroup);
