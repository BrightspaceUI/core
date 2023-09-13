import '../../button/button.js';
import '../dropdown.js';
import '../dropdown-content.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { styleMap } from 'lit/directives/style-map.js';

function createDropdown(positionStyles = {}) {
	const styles = { position: 'absolute', ...positionStyles };
	return html`
		<div style="border: 1px solid black; height: 300px; overflow: hidden; position: relative; width: 300px;">
			<div style="${styleMap(styles)}">
				<d2l-dropdown>
					<d2l-button class="d2l-dropdown-opener">Opener</d2l-button>
					<d2l-dropdown-content class="vdiff-include">
						<div>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker</div>
						<div>Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.</div>
					</d2l-dropdown-content>
				</d2l-dropdown>
			</div>
		</div>
	`;
}

describe('dropdown-content-contained', () => {
	[
		{ name: 'contained-top', positionStyles: { top: 0 } },
		{ name: 'contained-bottom', positionStyles: { bottom: 0 } }
	].forEach(({ name, positionStyles }) => {
		it(name, async() => {
			const elem = await fixture(createDropdown(positionStyles));
			const content = elem.querySelector('d2l-dropdown-content');
			content.toggleOpen();
			await oneEvent(content, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});
	});
});
