import '../colors/colors.js';
import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export const pagePanelStyles = css`
	.panel-header:not([hidden]) {
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.panel-header {
		background-color: white;
		border-bottom: 1px solid var(--d2l-color-mica);
		height: 70px;
		overflow: hidden;
		padding: 0 30px;
		position: sticky;
		top: 0;
		z-index: 14; /* To be over sticky content of our core components, but not over the header shadow */
	}

	.header-start,
	.header-end {
		display: flex;
		gap: 6px;
	}

	.panel {
		padding: 30px;
	}
`;

export const PagePanelMixin = superclass => class extends superclass {

	static properties = {
		_hasHeader: { state: true },
		_slotVisibility: { state: true }
	};

	constructor() {
		super();
		this._hasHeader = false;
		this._slotVisibility = {};
	}

	_handleSlotVisibilityChange(e) {
		const key = e.target.name;
		const nodes = e.target.assignedNodes();
		this._slotVisibility = { ...this._slotVisibility, [key]: nodes.length !== 0 };

		this._hasHeader = this._slotVisibility['header-start'] || this._slotVisibility['header-end'];
	}

	_renderPanel(content) {
		const panelClasses = {
			'panel': true,
			'header-sticky': this._hasHeader
		};
		const header = html`
			<div ?hidden="${!this._hasHeader}" class="panel-header">
				<div class="header-start"><slot name="header-start" @slotchange="${this._handleSlotVisibilityChange}"></slot></div>
				<div class="header-end"><slot name="header-end" @slotchange="${this._handleSlotVisibilityChange}"></slot></div>
			</div>`;

		return html`
			<div>
				${header}
				<div class="${classMap(panelClasses)}">${content}</div>
			</div>
		`;
	}

};
