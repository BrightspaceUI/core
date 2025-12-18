import '../../../components/colors/colors.js';
import '../../../components/icons/icon.js';
import { css, html, LitElement } from 'lit';

/**
 * Separator component to be used between buttons in a navigational element.
 */
class NavigationSeparator extends LitElement {

	static get styles() {
		return css`
			:host {
				display: inline-block;
				margin: 0 9px;
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

customElements.define('d2l-labs-navigation-separator', NavigationSeparator);
