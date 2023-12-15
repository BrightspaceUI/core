import '../typography.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const longText = 'Grumpy wizards make toxic brew for the evil Queen and Jack. Grumpy wizards make toxic brew for the evil Queen and Jack.';

function createTypographyWrapper(content) {
	return html`
		<div class="d2l-typography" style="max-width: 320px; overflow: auto;">
			${content}
		</div>
	`;
}

describe('typography', () => {

	[
		{ screen: 'wide', viewport: { width: 800 } },
		{ screen: 'narrow', viewport: { width: 600 } }
	].forEach(({ screen, viewport }) => {

		describe(screen, () => {

			[ '1', '2', '3', '4'].forEach(level => {
				it(`heading-${level}`, async() => {
					const elem = await fixture(createTypographyWrapper(html`<h1 class="d2l-heading-${level}">${`Heading ${level}`}</h1>`), { viewport });
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			['body-standard', 'body-compact', 'body-small'].forEach(textClass => {
				it(textClass, async() => {
					const elem = await fixture(createTypographyWrapper(html`<div class="d2l-${textClass}">${longText}</div>`), { viewport });
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});

			[
				{ name: 'paragraph', template: html`
					<p>Grumpy wizards make toxic brew for the evil Queen and Jack.</p>
					<p>The five boxing wizards jump quickly.</p>
					<p>The wizard quickly jinxed the gnomes before they vaporized.</p>
				` },
				{ name: 'label', template: html`<div class="d2l-label-text">Some wonky label</div>` },
				{ name: 'blockquote', template: html`<blockquote class="d2l-blockquote">${longText}</blockquote>` },
				{ name: 'blockquote-rtl', rtl: true, template: html`<blockquote class="d2l-blockquote">${longText}</blockquote>` },
				{ name: 'bcsans', template: html`
					<div style="font-family: BC Sans;">
						<p style="font-weight: 300;">ᐂ ᐪ ᒤ ᔆ ᔌ ᔕ ᔤ ᔧ ᕯ ᗯ ᘏ ᘗ ᘩ ᘨ ᣱ</p>
						<p>ᐂ ᐪ ᒤ ᔆ ᔌ ᔕ ᔤ ᔧ ᕯ ᗯ ᘏ ᘗ ᘩ ᘨ ᣱ</p>
						<p style="font-weight: 700;">ᐂ ᐪ ᒤ ᔆ ᔌ ᔕ ᔤ ᔧ ᕯ ᗯ ᘏ ᘗ ᘩ ᘨ ᣱ</p>
					</div>
					<div style="font-family: BC Sans; font-style: italic;">
						<p style="font-weight: 300;">ᐂ ᐪ ᒤ ᔆ ᔌ ᔕ ᔤ ᔧ ᕯ ᗯ ᘏ ᘗ ᘩ ᘨ ᣱ</p>
						<p>ᐂ ᐪ ᒤ ᔆ ᔌ ᔕ ᔤ ᔧ ᕯ ᗯ ᘏ ᘗ ᘩ ᘨ ᣱ</p>
						<p style="font-weight: 700;">ᐂ ᐪ ᒤ ᔆ ᔌ ᔕ ᔤ ᔧ ᕯ ᗯ ᘏ ᘗ ᘩ ᘨ ᣱ</p>
					</div>
				` }
			].forEach(({ name, template, rtl }) => {
				it(name, async() => {
					const elem = await fixture(createTypographyWrapper(template), { viewport, rtl });
					await expect(elem).to.be.golden({ margin: 0 });
				});
			});
		});
	});
});
