import '../input-text.js';
import { expect } from '@open-wc/testing';
import { testRenderTime, html } from 'web-test-runner-performance/browser.js';
// import { expect, fixture, html, nextFrame, oneEvent } from '@open-wc/testing';

describe('d2l-input-text', () => {

	it('normal', async() => {
		const element = html`<d2l-input-text label="label"></d2l-input-text>`;
		const result = await testRenderTime(element, { iterations: 1000, average: 10 });
		console.log(result)
		expect(result.averages.length).to.eql(10);
		expect(result.duration).to.below(50);
		console.log(result.duration)
	});

	// it('slots', async() => {
	// 	await expect(html`<d2l-input-text label="label">
	// 		<span slot="left">left</span>
	// 		<span slot="right">right</span>
	// 		<span slot="after">after</span>
	// 	</d2l-input-text>`).to.be.performant(1500);
	// });

	// it('unit', async() => {
	// 	await expect(html`<d2l-input-text label="label" unit="%"></d2l-input-text>`)
	// 		.to.be.performant(1500);
	// });

});
