import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';

/**
 * Separator component to be used between buttons in a page header.
 */
class PageHeaderSeparator extends LitElement {

	static get styles() {
		return css`
			:host {
				display: inline-block;
				margin: 0 9px;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-icon {
				color: var(--d2l-color-mica);
			}
		`;
	}

	render() {
		return html`
			<d2l-icon icon="tier2:divider-big"></d2l-icon>
		`;
	}

}

customElements.define('d2l-page-header-separator', PageHeaderSeparator);
