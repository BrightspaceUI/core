import '../progress.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-progress', () => {

	[true, false].forEach(small => {
		it(small ? 'small' : 'basic', async() => {
			const ele = await fixture(html`<div>
				<d2l-progress label="No Progress" value="0" max="10" ?small=${small}></d2l-progress>
				<d2l-progress label="Progress" value="8" max="10" ?small=${small}></d2l-progress>
				<d2l-progress label="Complete" value="10" max="10" ?small=${small}></d2l-progress>
			</div>`);

			await expect(ele).to.be.golden();
		});
	});

	it('hidden states', async() => {
		const ele = await fixture(html`<div>
			<d2l-progress label="Progress" label-hidden></d2l-progress>
			<br>
			<d2l-progress label="Progress" value-hidden></d2l-progress>
			<br>
			<d2l-progress label="Progress" label-hidden value-hidden></d2l-progress>
		</div>`);

		await expect(ele).to.be.golden();
	});

});
