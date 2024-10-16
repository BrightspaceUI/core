import '../dialog-confirm.js';
import '../../button/button.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-dialog-confirm', () => {

	it('closed', async() => {
		const el = await fixture(html`<d2l-dialog-confirm></d2l-dialog-confirm>`);
		await expect(el).to.be.accessible();
	});

	it('default with title-text', async() => {
		const el = await fixture(html`<d2l-dialog-confirm opened title-text="My Dialog" text="My dialog content"></d2l-dialog-confirm>`);
		await expect(el).to.be.accessible();
	});

	it('critical', async() => {
		const el = await fixture(html`<d2l-dialog-cofirm opened title-text="My Dialog" critical text="My dialog content"></d2l-dialog-confirm>`);
		await expect(el).to.be.accessible();
	});

	it('footer buttons', async() => {
		const el = await fixture(html`
			<d2l-dialog-cofirm title-text="Dialog Title" opened text="My dialog content">
				<d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
				<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog-confirm>
		`);
		await expect(el).to.be.accessible();
	});

	it('no title-text', async() => {
		const el = await fixture(html`<d2l-dialog-cofirm opened text="My dialog content"></d2l-dialog-confirm>`);
		await expect(el).to.be.accessible();
	});

});
