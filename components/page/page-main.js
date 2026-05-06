import { css, html, LitElement } from 'lit';
import { isWindows, pageScrollStyles, panelStyles } from './styles.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Component to be placed in the main default slot of d2l-page, providing a panel with optional header
 * @slot - The main content of the main page panel
 * @slot header - Optional header content of the main page panel
 */
class PageMain extends LitElement {

	static get properties() {
		return {
			_hasHeader: { state: true }
		};
	}

	static get styles() {
		return [panelStyles, pageScrollStyles, css`
			:host {
				display: block;
				height: 100%;
			}

			:host([hidden]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this._hasHeader = false;
	}

	render() {
		const scrollClasses = {
			'panel-scroll': true,
			'd2l-page-scroll': isWindows
		};

		const header = html`
			<div ?hidden="${!this._hasHeader}" class="panel-header">
				<slot name="header" @slotchange="${this.#handleHeaderSlotChange}"></slot>
			</div>`;

		return html`
			<div class="panel">
				${header}
				<div class="${classMap(scrollClasses)}"><slot></slot></div>
			</div>
		`;
	}

	#handleHeaderSlotChange(e) {
		const nodes = e.target.assignedNodes();
		this._hasHeader = (nodes.length !== 0);
	}

}

customElements.define('d2l-page-main', PageMain);
