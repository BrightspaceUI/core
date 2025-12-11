import { css, LitElement } from 'lit';

/**
 * A component to force tiles to break onto a new row.
 */
class ListTileBreak extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
				flex-basis: 100%;
				height: 0;
			}
		`;
	}

}

customElements.define('d2l-list-tile-break', ListTileBreak);
