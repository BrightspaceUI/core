import '../overflow-group.js';
import '../../button/button.js';
import { fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

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

});
