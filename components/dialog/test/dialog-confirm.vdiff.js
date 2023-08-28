import '../../button/button.js';
import '../dialog-confirm.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const buttons = html`
	<d2l-button slot="footer" primary>Yes</d2l-button>
	<d2l-button slot="footer" id="cancel">No</d2l-button>
`;

const confirmDialog = html`
	<d2l-dialog-confirm id="confirm" title-text="Title" text="Are you sure?" opened>
		${buttons}
	</d2l-dialog-confirm>
`;

describe('dialog-confirm', () => {

	[/*'native',*/ 'custom'].forEach((type) => {

		describe(type, () => {
			before(() => window.D2L.DialogMixin.preferNative = type === 'native');

			[
				{ screen: 'wide', viewport: { width: 800, height: 500 } },
				{ screen: 'narrow', viewport: { width: 600, height: 500 } }
			].forEach(({ screen, viewport }) => {
				describe(screen, () => {
					[
						{ name: 'opened', template: confirmDialog },
						{ name: 'rtl', rtl: true, template: confirmDialog },
					].forEach(({ name, template, rtl }) => {
						it(name, async() => {
							await fixture(template, { viewport, rtl });
							await expect(document).to.be.golden();
						});
					});
				});
			});

			describe('internal', () => {

				[
					{ name: 'short', template: confirmDialog },
					{ name: 'long-title', template: html`
						<d2l-dialog-confirm title-text="A title that is really long and should wrap onto a second line." text="Are you sure?" opened>
							${buttons}
						</d2l-dialog-confirm>
					` },
					{ name: 'no-title', template: html`<d2l-dialog-confirm text="Are you sure?" opened>${buttons}</d2l-dialog-confirm>` },
					{ name: 'long-text', template: html`
						<d2l-dialog-confirm title-text="Title" text="Some confirm dialog content that should wrap onto a second line?" opened>
							${buttons}
						</d2l-dialog-confirm>
					` },
					{ name: 'long-buttons', template: html`
						<d2l-dialog-confirm title-text="Title" text="Are you sure?" opened>
							<d2l-button slot="footer" primary>A really long workflow button.</d2l-button>
							<d2l-button slot="footer" id="cancel">Another really long workflow button.</d2l-button>
						</d2l-dialog-confirm>
					` },
					{ name: 'multiple-paragraphs', template: html`
						<d2l-dialog-confirm title-text="Title" text="Paragraph 1&#10;Paragraph 2" opened>
							${buttons}
						</d2l-dialog-confirm>
					` }
				].forEach(({ name, template }) => {
					it(name, async() => {
						const elem = await fixture(template, { viewport: { width: 800, height: 500 } });
						await expect(elem).to.be.golden();
					});
				});
			});
		});
	});
});
