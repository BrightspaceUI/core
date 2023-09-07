import '../expand-collapse-content.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

function createExpandCollapse(expanded) {
	return html`
		<d2l-expand-collapse-content ?expanded="${expanded}" style="border: 4px solid blue;">
			<ul style="border: 4px solid green;">
				<li>Coffee</li>
				<li>Tea</li>
				<li>Milk</li>
			</ul>
		</d2l-expand-collapse-content>
	`;
}

describe('expand-collapse-content', () => {
	[
		{ name: 'collapsed', expanded: false },
		{ name: 'expanded', expanded: true }
	].forEach(({ name, expanded }) => {
		it(name, async() => {
			const elem = await fixture(createExpandCollapse(expanded), { viewport: { width: 400 } });
			await expect(elem).to.be.golden();
		});
	});
});
