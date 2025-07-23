import '../progress-bar.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const collapsedContentFixture = html`<d2l-progress-bar>A message.</d2l-progress-bar>`;
const expandedContentFixture = html`<d2l-progress-bar expanded>A message.</d2l-progress-bar>`;

describe('d2l-progress-bar', () => {

	[true, false].forEach(small => {
		it(small ? 'small' : 'basic', async () => {
			const ele = await fixture(html`<div>
				<d2l-progress-bar label="No Progress" value="0" max-value="10" ?small=${small}></d2l-progress-bar>
				<d2l-progress-bar label="Progress" value="8" max-value="10" ?small=${small}></d2l-progress-bar>
				<d2l-progress-bar label="Complete" value="10" max-value="10" ?small=${small}></d2l-progress-bar>
			</div>`)

			await expect(ele).to.be.golden();
		})
	})

	it('hidden states', async () => {
		const ele = await fixture(html`<div>
			<d2l-progress-bar label="Progress" label-hidden></d2l-progress-bar>
			<br>
			<d2l-progress-bar label="Progress" value-hidden></d2l-progress-bar>
			<br>
			<d2l-progress-bar label="Progress" label-hidden value-hidden></d2l-progress-bar>
		</div>`)

		await expect(ele).to.be.golden();
	});

});
