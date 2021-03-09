import '../overflow-group.js';
import '../../button/button.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-overflow-group', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-overflow-group');
		});
	});

	describe('dynamically add/remove buttons', () => {
		it ('append', async() => {
			const container = await fixture(html`<d2l-overflow-group max-to-show="2">
				<d2l-button>1</d2l-button>
				<d2l-button>2</d2l-button>
				<d2l-button>3</d2l-button>
			</d2l-overflow-group>`);
			const newButton = document.createElement('d2l-button');
			newButton.innerText = '4'
			const handleUpdate = () => {
				const chompedItems = container.querySelectorAll('[data-is-chomped]');
				console.log(container)
				console.log('1122');

				console.log(container.getAttribute('_chompIndex'));
				expect(chompedItems.length).to.equal(1);
			};

			const chompedItems = container.querySelectorAll('[chomped]');
			expect(chompedItems.length).to.equal(0);
			container.addEventListener('d2l-overflow-group-updated', handleUpdate);
			container.appendChild(newButton);

		});
		it ('remove', async() => {
			const container = await fixture(html`<d2l-overflow-group max-to-show="2">
				<d2l-button>1</d2l-button>
				<d2l-button>2</d2l-button>
				<d2l-button id="last">3</d2l-button>
			</d2l-overflow-group>`);
			const handleUpdate = () => {
				const chompedItems = container.querySelectorAll('[data-is-chomped]');
				expect(chompedItems.length).to.equal(0);
			};
			const lastButton = container.querySelector('#last');
			const chompedItems = container.querySelectorAll('[data-is-chomped]');
			expect(chompedItems.length).to.equal(1);
			container.addEventListener('d2l-overflow-group-updated', handleUpdate);
			container.removeChild(lastButton);
		});
	});
});
