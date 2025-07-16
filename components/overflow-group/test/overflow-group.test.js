import '../overflow-group.js';
import '../../button/button.js';
import '../../button/button-icon.js';
import '../../button/button-subtle.js';
import '../../selection/selection-action.js';
import { defineCE, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { LocalizeCoreElement } from '../../../helpers/localize-core-element.js';

const tagName = defineCE(
	class extends LocalizeCoreElement(LitElement) {
		render() {
			return html`
				<d2l-overflow-group min-to-show="0" max-to-show="0">
					<d2l-button>${this.localize('components.overflow-group.moreActions')}</d2l-button>
					<d2l-button> ${this.localize('components.overflow-group.moreActions')}</d2l-button>
					<button>${this.localize('components.overflow-group.moreActions')}</button>
					<d2l-button-icon icon="tier1:gear" text="${this.localize('components.overflow-group.moreActions')}"></d2l-button-icon>
					<d2l-button-subtle text="${this.localize('components.overflow-group.moreActions')}"></d2l-button-subtle>
					<d2l-selection-action icon="tier1:bookmark-hollow" text="${this.localize('components.overflow-group.moreActions')}"></d2l-selection-action>
				</d2l-overflow-group>
			`;
		}
	}
);

describe('d2l-overflow-group', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-overflow-group');
		});
	});

	describe('dynamically add/remove buttons', () => {

		it ('append', async() => {
			const container = await fixture(html`<d2l-overflow-group max-to-show="3">
				<d2l-button>1</d2l-button>
				<d2l-button>2</d2l-button>
				<d2l-button>3</d2l-button>
			</d2l-overflow-group>`);
			const newButton = document.createElement('d2l-button');
			container.appendChild(newButton);
			await oneEvent(container, 'd2l-overflow-group-updated');

		});

		it ('remove', async() => {
			const container = await fixture(html`<d2l-overflow-group max-to-show="2">
				<d2l-button>1</d2l-button>
				<d2l-button>2</d2l-button>
				<d2l-button id="last">3</d2l-button>
			</d2l-overflow-group>`);
			const lastButton = container.querySelector('#last');
			container.removeChild(lastButton);
			await oneEvent(container, 'd2l-overflow-group-updated');
		});

	});

	it('use correct node to grab text for menu item', async() => {
		const container = await fixture(`<${tagName}></${tagName}>`);
		const overflowGroup = container.shadowRoot.querySelector('d2l-overflow-group');
		await overflowGroup.updateComplete;

		const menuItems = overflowGroup.shadowRoot.querySelectorAll('d2l-menu-item');
		Array.from(menuItems).forEach(item => {
			expect(item.text).to.equal('More Actions');
		});
	});

});
