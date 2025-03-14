import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { SkeletonGroupMixin } from '../skeleton/skeleton-group-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

/**
 * A component that renders a container and layout for collapsible panels
 * @slot default - Slot for panels. Only accepts `d2l-collapsible-panel`
 */
class CollapsiblePanelGroup extends SkeletonGroupMixin(LitElement) {

	static get properties() {
		return {
			_spaced: { state: true }
		};
	}

	static get styles() {
		return css`
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
		`;
	}

	constructor() {
		super();
		this._panels = new SubscriberRegistryController(this, 'collapsible-panel-group');
		this._spaced = true;
	}

	render() {
		const classes = {
			spaced: this._spaced,
		};

		return html`<slot class="${classMap(classes)}"></slot>`;
	}

	_updatePanelAttributes() {
		const panels = this.shadowRoot
			?.querySelector('slot')
			?.assignedNodes({ flatten: true })
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'D2L-COLLAPSIBLE-PANEL');
		if (!panels || panels.length === 0) return;

		const isInline = panels[0].type === 'inline';
		this._spaced = !isInline;
		for (let i = 0; i < panels.length; i++) {
			if (i < panels.length - 1) {
				panels[i]._noBottomBorder = isInline;
			} else {
				panels[i]._noBottomBorder = false;
			}
		}
	}
}

customElements.define('d2l-collapsible-panel-group', CollapsiblePanelGroup);
