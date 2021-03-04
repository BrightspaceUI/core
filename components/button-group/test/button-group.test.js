import '../button-group.js';
import '../../button/button.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-button-group', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-button-group');
		});
	});

	describe('dynamically add/remove buttons', () => {
		it ('append', async() => {
			const container = await fixture(html`<d2l-button-group id="test1" max-to-show="2">
				<d2l-button>1</d2l-button>
				<d2l-button>2</d2l-button>
				<d2l-button>3</d2l-button>
			</d2l-button-group>`);
			const newButton = document.createElement('d2l-button');
			const handleUpdate = () => {
				console.log('newcontainer');
				const chompedItems = container.querySelectorAll('[chomped]');
				console.log('chompedItems');
				console.log(chompedItems);
				expect(chompedItems.length).to.equal(1);
			};
			// const buttonGroup = fixture(id).querySelector('d2l-button-group');

			container.addEventListener('d2l-button-group-updated', handleUpdate);
			container.appendChild(newButton);

			console.log('test111222')
		});
		it ('remove', async() => {
			const container = await fixture(html`<d2l-button-group id="test1" max-to-show="2">
				<d2l-button>1</d2l-button>
				<d2l-button>2</d2l-button>
				<d2l-button>3</d2l-button>
			</d2l-button-group>`);
			const newButton = document.createElement('d2l-button');
			const handleUpdate = () => {
				console.log('newcontainer');
				const chompedItems = container.querySelectorAll('[chomped]');
				console.log('chompedItems');
				console.log(chompedItems);
				expect(chompedItems.length).to.equal(1);
			};
			// const buttonGroup = fixture(id).querySelector('d2l-button-group');

			container.addEventListener('d2l-button-group-updated', handleUpdate);
			container.appendChild(newButton);

			console.log('test111222')
		});
	});
});
