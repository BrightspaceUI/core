import '../input-percent.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-input-percent label="label"></d2l-input-percent>`;
const defaultValueFixture = html`<d2l-input-percent label="label" value="80"></d2l-input-percent>`;

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: false }
	);
	elem.dispatchEvent(e);
}

describe('d2l-input-percent', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-input-percent');
		});
	});

	describe('events', () => {

		it('should not fire "change" event when property changes', async() => {
			const elem = await fixture(normalFixture);

			let fired = false;
			elem.addEventListener('change', () => { fired = true; });

			elem.value = 10;
			await elem.updateComplete;
			expect(fired).to.be.false;

			elem.setAttribute('value', 15);
			await elem.updateComplete;
			expect(fired).to.be.false;
		});

		it('should fire "change" event when underlying value changes', async() => {
			const elem = await fixture(defaultValueFixture);
			await aTimeout(1);

			const inputNumberElement = elem.shadowRoot.querySelector('d2l-input-number');
			setTimeout(() => {
				inputNumberElement.value = 90;
				dispatchEvent(inputNumberElement, 'change');
			});
			await oneEvent(elem, 'change');

			expect(elem.value).to.equal(90);
		});

		it('should not fire "change" event when underlying value doesn\'t change', async() => {
			const elem = await fixture(defaultValueFixture);
			let fired = false;
			elem.addEventListener('change', () => { fired = true; });

			const inputNumberElement = elem.shadowRoot.querySelector('d2l-input-number');
			setTimeout(() => {
				inputNumberElement.setAttribute('value', 80);
				dispatchEvent(inputNumberElement, 'change');
			});
			await aTimeout(1);

			expect(fired).to.be.false;
		});

	});

});
