import '../overflow-group.js';
import '../../button/button.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import sinon from 'sinon';

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
			const handleUpdate = sinon.spy();
			container.addEventListener('d2l-overflow-group-updated', handleUpdate);
			setTimeout(() => expect(handleUpdate).to.have.been.called);

		});
		it ('remove', async() => {
			const container = await fixture(html`<d2l-overflow-group max-to-show="2">
				<d2l-button>1</d2l-button>
				<d2l-button>2</d2l-button>
				<d2l-button id="last">3</d2l-button>
			</d2l-overflow-group>`);
			const lastButton = container.querySelector('#last');
			const handleUpdate = sinon.spy();
			container.addEventListener('d2l-overflow-group-updated', handleUpdate);
			container.removeChild(lastButton);

			setTimeout(() => expect(handleUpdate).to.have.been.called);

		});
	});
});
