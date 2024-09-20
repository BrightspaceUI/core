import '../dialog.js';
import '../../button/button.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-dialog', () => {

	it('closed', async() => {
		const el = await fixture(html`<d2l-dialog></d2l-dialog>`);
		await expect(el).to.be.accessible();
	});

	it('default with title-text', async() => {
		const el = await fixture(html`<d2l-dialog opened title-text="My Dialog"></d2l-dialog>`);
		await expect(el).to.be.accessible();
	});

	it('describe-content', async() => {
		const el = await fixture(html`<d2l-dialog opened title-text="My Dialog" describe-content>My content</d2l-dialog>`);
		await expect(el).to.be.accessible();
	});

	it('footer buttons', async() => {
		const el = await fixture(html`
			<d2l-dialog title-text="Dialog Title" opened>
				<div>Some dialog content</div>
				<d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
				<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		`);
		await expect(el).to.be.accessible();
	});

	it('tall content', async() => {
		const el = await fixture(html`
			<d2l-dialog opened title-text="My Dialog">
				<div style="height: 10000px;">My content</div>
			</d2l-dialog>
		`);
		await expect(el).to.be.accessible();
	});

	it('tall content with footer buttons', async() => {
		const el = await fixture(html`
			<d2l-dialog opened title-text="My Dialog">
				<div style="height: 10000px;">My content</div>
				<d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
				<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		`);
		await expect(el).to.be.accessible();
	});

	it.skip('no title-text', async() => {
		const el = await fixture(html`<d2l-dialog opened>My content</d2l-dialog>`);
		await expect(el).to.be.accessible();
	});

});
