import '../validation-custom.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = html`
	<div>
		<div>
			<input id="target" type="text"/>
		</div>
		<d2l-validation-custom for="target" failure-text="An error occurred"></d2l-validation-custom>
	</div>
`;

describe('d2l-validation-custom', () => {

	let root, custom;

	beforeEach(async() => {
		root = await fixture(basicFixture);
		custom = root.querySelector('d2l-validation-custom');
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-validation-custom');
		});

	});

	describe('for', () => {

		it('should find for-element using for attribute', () => {
			const expectedForElement = root.querySelector('#target');
			expect(custom.forElement).to.equal(expectedForElement);
		});

	});

	describe('events', () => {

		it('should fire connected event', async() => {
			const unconnectedCustom = document.createElement('d2l-validation-custom');
			setTimeout(() => root.appendChild(unconnectedCustom), 0);
			await oneEvent(unconnectedCustom, 'd2l-validation-custom-connected');
		});

		it('should fire disconnected event', async() => {
			setTimeout(() => custom.remove(), 0);
			await oneEvent(custom, 'd2l-validation-custom-disconnected');
			expect(custom.forElement).to.be.null;
		});

		[true, false].forEach(expectedIsValid => {

			it('should fire validate event for async handler', async() => {
				const validationHandler = async(e) => {
					await aTimeout(0);
					e.detail.resolve(expectedIsValid);
				};
				custom.addEventListener('d2l-validation-custom-validate', validationHandler);
				const isValid = await custom.validate();
				expect(isValid).to.equal(expectedIsValid);
			});

			it('should fire validate event for sync handler', async() => {
				const validationHandler = (e) => {
					e.detail.resolve(expectedIsValid);
				};
				custom.addEventListener('d2l-validation-custom-validate', validationHandler);
				const isValid = await custom.validate();
				expect(isValid).to.equal(expectedIsValid);
			});

		});

	});

});
