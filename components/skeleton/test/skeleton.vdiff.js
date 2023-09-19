import '../demo/skeleton-test-box.js';
import '../demo/skeleton-test-container.js';
import '../demo/skeleton-test-heading.js';
import '../demo/skeleton-test-link.js';
import '../demo/skeleton-test-paragraph.js';
import '../demo/skeleton-test-width.js';
import '../demo/skeleton-test-stack.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-skeleton', () => {

	['ltr', 'rtl'].forEach(dir => {

		const rtl = dir === 'rtl';

		describe(dir, () => {

			['standard', 'compact', 'small', 'label'].forEach((type) => {
				it(`typography-${type}`, async() => {
					const elem = await fixture(html`<d2l-test-skeleton-paragraph type="${type}" skeleton></d2l-test-skeleton-paragraph>`, { rtl });
					await expect(elem).to.be.golden();
				});
				[2, 3, 5].forEach((lines) => {
					it(`typography-${type}-paragraph-${lines}`, async() => {
						const elem = await fixture(html`<d2l-test-skeleton-paragraph type="${type}" lines="${lines}" skeleton></d2l-test-skeleton-paragraph>`, { rtl });
						await expect(elem).to.be.golden();
					});
				});
			});

			['normal', 'main', 'small'].forEach((type) => {
				it(`link-${type}`, async() => {
					const elem = await fixture(html`<d2l-test-skeleton-link type="${type}" skeleton></d2l-test-skeleton-link>`, { rtl });
					await expect(elem).to.be.golden();
				});
			});

			[1, 2, 3, 4].forEach((level) => {
				it(`heading-${level}`, async() => {
					const elem = await fixture(html`<d2l-test-skeleton-heading level="${level}" skeleton>Heading ${level}</d2l-test-skeleton-heading>`, { rtl });
					await expect(elem).to.be.golden();
				});
				it(`heading-${level}-multiline`, async() => {
					const elem = await fixture(html`<d2l-test-skeleton-heading level="${level}" skeleton>Heading ${level}<br>on multiple lines</d2l-test-skeleton-heading>`, { rtl });
					await expect(elem).to.be.golden();
				});
			});

			[
				{ name: 'box', template: html`<d2l-test-skeleton-box skeleton></d2l-test-skeleton-box>` },
				{ name: 'container', template: html`<d2l-test-skeleton-container skeleton></d2l-test-skeleton-width>` },
				{ name: 'width', template: html`<d2l-test-skeleton-width skeleton></d2l-test-skeleton-width>`, viewport: { height: 1000 } },
				{ name: 'stack', template: html`<div style="position: relative;"><div style="line-height: 1em;margin: -0.5em;position: absolute;top: 0;width: 100%;z-index: 1;">Stack 1: 1</div><d2l-test-skeleton-stack skeleton></d2l-test-skeleton-stack></div>` }
			].forEach(({ name, template, viewport }) => {
				it(name, async() => {
					const elem = await fixture(template, { rtl, viewport });
					await expect(elem).to.be.golden();
				});
			});

		});

	});

});
