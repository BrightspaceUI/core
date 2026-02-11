import '../backdrop-loading.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const template = html`
	<div style="background-color: orange; height: 600px; padding: 1rem; width: 800px;">
		<style>
			th, td {
				border: 1px solid #dddddd;
				padding: 30px;
				text-align: left;
			}
			#grade-container {
				position: relative;
				width: fit-content;
			}
		</style>
		<div id="grade-container" style="position:relative;width:fit-content;">
			<table>
				<thead>
					<th>Course</th>
					<th>Grade</th>
					<th>Hours Spent in Content</th>
				</thead>
				<tr>
					<td>Math</td>
					<td class="grade">85%</td>
					<td>100</td>
				</tr>
				<tr>
					<td>Art</td>
					<td class="grade">98%</td>
					<td>10</td>
				</tr>
			</table>
			<d2l-backdrop-loading></d2l-backdrop-loading>
		</div>
	</div>
`;

describe('backdrop-loading', () => {
	it('not shown', async() => {
		const elem = await fixture(template);
		await expect(elem).to.be.golden();
	});

	it('shown', async() => {
		const elem = await fixture(template);
		elem.querySelector('d2l-backdrop-loading').shown = true;
		await expect(elem).to.be.golden();
	});
});
