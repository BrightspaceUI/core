import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A component for a branded D2L page footer. To be contained between <footer> tags.
 * TODO: warning if parent isn't footer
 */
class Footer extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether the footer has a background color or inherits the page's background color. Default is false, inherit page background color.
			 * @type {bool}
			 */
			color: { type: Boolean },
		};
	}
	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				width: 100%;
			}

			div {
				align-items: center;
				display: flex;
				height: 5rem;
				justify-content: center;
			}
			:host([color]) div {
				background-color: var(--d2l-color-sylvite);
			}
		`];
	}

	constructor() {
		super();
		this.color = false;
	}

	render() {

		return html`
			<div class="d2l-body-compact">${this.localize('components.footer.poweredBy')}</div>
		`;
	}

}

customElements.define('d2l-footer', Footer);
