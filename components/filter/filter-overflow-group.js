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

	convertToOverflowItem(node) {
		const tagName = node.tagName.toLowerCase();
		if (tagName !== 'd2l-filter') console.warn(`d2l-filter-overflow-group: ${tagName} is invalid in this group. This group should only contain d2l-filter direct child elements.`);
	}

	getOverflowContainer() {
	}

}

customElements.define('d2l-filter-overflow-group', FilterOverflowGroup);
