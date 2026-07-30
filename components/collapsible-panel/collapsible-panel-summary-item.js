import '../colors/colors.js';
import { css, html, LitElement, nothing } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { getOverflowDeclarations } from '../../helpers/overflow.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A component for a "summary item" child component that describes the content in a collapsible panel.
 */
class CollapsiblePanelSummaryItem extends SkeletonMixin(LitElement) {

	static properties = {
		/**
		 * The number of lines to display before truncating text with an ellipsis. The text will not be truncated unless a value is specified.
		 * @type {number}
		 */
		lines: { type: Number },
		/**
		 * REQUIRED: Text that is displayed
		 * @type {string}
		 */
		text: { type: String },
	};

	static styles = [super.styles, bodySmallStyles, css`
		:host {
			color: var(--d2l-theme-text-color-static-faint);
			display: block;
		}
		:host([hidden]) {
			display: none;
		}
		.d2l-body-small {
			line-height: 1.2rem;
		}
	`];

	constructor() {
		super();
		this.text = '';
		this.lines = 0;
	}

	render() {
		const styles = this.lines ? getOverflowDeclarations({ lines: this.lines }) : null;
		return html`<p class="d2l-body-small d2l-skeletize" style="${styles ?? nothing}">${this.text}</p>`;
	}
}

customElements.define('d2l-collapsible-panel-summary-item', CollapsiblePanelSummaryItem);
