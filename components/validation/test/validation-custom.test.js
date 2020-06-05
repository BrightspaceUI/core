import '../validation-custom.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
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

	describe('target', () => {

		it('should find target using for attribute', () => {
			const expectedTarget = root.querySelector('#target');
			expect(custom.target).to.equal(expectedTarget);
		});

	});

	describe('events', () => {

		it('should fire connected event', async() => {
			const custom = document.createElement('d2l-validation-custom');
			setTimeout(() => root.appendChild(custom), 0);
			await oneEvent(custom, 'd2l-validation-custom-connected');
		});

		it('should fire disconnected event', async() => {
			setTimeout(() => custom.remove(), 0);
			await oneEvent(custom, 'd2l-validation-custom-disconnected');
			expect(custom.target).to.be.null;
		});

		[true, false].forEach(expectedIsValid => {

			it('should fire validate event', async() => {
				const validationHandler = async(e) => {
					await aTimeout(0);
					e.detail.resolve(expectedIsValid);
				};
				custom.addEventListener('d2l-validation-custom-validate', validationHandler);
				const isValid = await custom.validate();
				expect(isValid).to.equal(expectedIsValid);
			});

		});

	});

});
