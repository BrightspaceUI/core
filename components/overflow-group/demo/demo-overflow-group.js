
import '../../button/button.js';
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
				<d2l-button> ${this.localize('components.more-less.less')}</d2l-button>
			</d2l-overflow-group>
		`;
	}
}
customElements.define('d2l-demo-overflow-group', DemoOverflowGroup);
