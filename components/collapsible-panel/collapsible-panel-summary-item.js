import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A component for a "summary item" child component that describes the content in a collapsible panel.
 */
class CollapsiblePanelSummaryItem extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
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
	}

	static get styles() {
		return [super.styles, bodySmallStyles, css`
			:host {
				color: var(--d2l-color-galena);
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-body-small {
				line-height: 1.2rem;
			}
			p.truncate {
				-webkit-box-orient: vertical;
				display: -webkit-box;
				overflow: hidden;
				overflow-wrap: anywhere;
			}
		`];
	}

	constructor() {
		super();
		this.text = '';
		this.lines = 0;
	}

	render() {
		const classes = {
			'd2l-body-small': true,
			'd2l-skeletize': true,
			'truncate': this.lines > 0
		};
		const styles = (this.lines > 0) ? { '-webkit-line-clamp': this.lines } : {};
		return html`<p class="${classMap(classes)}" style="${styleMap(styles)}">${this.text}</p>`;
	}
}

customElements.define('d2l-collapsible-panel-summary-item', CollapsiblePanelSummaryItem);
