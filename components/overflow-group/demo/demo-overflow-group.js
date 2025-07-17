
import '../../button/button.js';
import '../../button/button-icon.js';
import '../../button/button-subtle.js';
import '../../selection/selection-action.js';
import '../overflow-group.js';
import { html, LitElement } from 'lit';
import { LocalizeCoreElement } from '../../../helpers/localize-core-element.js';

class DemoOverflowGroup extends LocalizeCoreElement(LitElement) {
	render() {
		return html`
			<d2l-overflow-group>
				<d2l-button primary>${this.localize('components.more-less.more')}</d2l-button>
				<d2l-button>${this.localize('components.more-less.less')}</d2l-button>
				<d2l-button>${this.localize('components.more-less.more')}</d2l-button>
				<d2l-button>${this.localize('components.more-less.less')}</d2l-button>
				<d2l-button>${this.localize('components.more-less.more')}</d2l-button>
				<d2l-button>${this.localize('components.more-less.less')}</d2l-button>
				<d2l-button> ${this.localize('components.more-less.more')}</d2l-button>
				<button>${this.localize('components.more-less.less')}</button>
				<d2l-button-icon icon="tier1:gear" text="${this.localize('components.more-less.more')}"></d2l-button-icon>
				<d2l-button-subtle text="${this.localize('components.more-less.less')}"></d2l-button-subtle>
				<d2l-selection-action icon="tier1:bookmark-hollow" text="${this.localize('components.more-less.more')}"></d2l-selection-action>
			</d2l-overflow-group>
		`;
	}
}
customElements.define('d2l-demo-overflow-group', DemoOverflowGroup);
