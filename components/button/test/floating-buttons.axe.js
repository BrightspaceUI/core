import '../button.js';
import '../floating-buttons.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const basicFixture = html`
	<d2l-floating-buttons>
		<d2l-button primary>Primary Button</d2l-button>
		<d2l-button>Secondary Button</d2l-button>
	</d2l-floating-buttons>
`;

const alwaysFloatFixture = html`
	<d2l-floating-buttons always-float>
		<d2l-button primary>Save</d2l-button>
		<d2l-button>Cancel</d2l-button>
	</d2l-floating-buttons>
`;

const multipleButtonsFixture = html`
	<d2l-floating-buttons>
		<d2l-button primary>Submit</d2l-button>
		<d2l-button>Save Draft</d2l-button>
		<d2l-button>Preview</d2l-button>
		<d2l-button>Cancel</d2l-button>
	</d2l-floating-buttons>
`;

describe('d2l-floating-buttons', () => {

	it('basic', async() => {
		const elem = await fixture(basicFixture);
		await expect(elem).to.be.accessible();
	});

	it('always-float', async() => {
		const elem = await fixture(alwaysFloatFixture);
		await expect(elem).to.be.accessible();
	});

	it('multiple buttons', async() => {
		const elem = await fixture(multipleButtonsFixture);
		await expect(elem).to.be.accessible();
	});

	it('with focused button', async() => {
		const elem = await fixture(basicFixture);
		const button = elem.querySelector('d2l-button[primary]');
		await focusElem(button);
		await expect(elem).to.be.accessible();
	});

	it('single button', async() => {
		const elem = await fixture(html`
			<d2l-floating-buttons>
				<d2l-button primary>Save</d2l-button>
			</d2l-floating-buttons>
		`);
		await expect(elem).to.be.accessible();
	});

	it('with disabled button', async() => {
		const elem = await fixture(html`
			<d2l-floating-buttons>
				<d2l-button primary>Save</d2l-button>
				<d2l-button disabled>Cancel</d2l-button>
			</d2l-floating-buttons>
		`);
		await expect(elem).to.be.accessible();
	});

});
