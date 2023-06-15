import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A component that renders a container and layout for collapsible panels
 * @slot default - Slot for panels. Only accepts `d2l-collapsible-panel`
 */
class CollapsiblePanelGroup extends LitElement {

	static get properties() {
		return {
			_panels: { state: true },
		};
	}

	static get styles() {
		return [super.styles, css`
			:host ::slotted(*) {
				display: none;
			}
			:host ::slotted(d2l-collapsible-panel) {
				display: unset;
			}
			.spaced {
				display: flex;
				flex-direction: column;
				row-gap: 0.5rem;
			}
		`];
	}

	constructor() {
		super();
		this._panels = [];
	}

	render() {
		const classes = {
			spaced: this._panels?.[0]?.type !== 'inline',
		};

		return html`<slot class="${classMap(classes)}" @slotchange="${this._handleSlotChange}"></slot>`;
	}

	async _getPanels() {
		const slot = this.shadowRoot?.querySelector('slot');
		if (!slot) return;

		return slot.assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);
	}

	async _handleSlotChange() {
		this._panels = await this._getPanels();
		this._updatePanelAttributes();
	}

	_updatePanelAttributes() {
		if (!this._panels || this._panels.length === 0) return;

		if (this._panels[0]?.type !== 'inline') return;

		for (const panel of this._panels) {
			panel._noBottomBorder = true;
		}

		this._panels[this._panels.length - 1]._noBottomBorder = false;
	}
}

customElements.define('d2l-collapsible-panel-group', CollapsiblePanelGroup);
