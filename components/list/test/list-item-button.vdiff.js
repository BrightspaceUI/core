import '../list.js';
import '../list-item-button.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

const simpleListItemContent = html`
	<d2l-list-item-content>
		<div>Item 1</div>
		<div slot="supporting-info">Secondary info for item 1</div>
	</d2l-list-item-content>
`;

describe('list-item-button', () => {
	[true, false].forEach(disabled => {
		describe(`button${disabled ? '-disabled' : ''}`, () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: focusElem, margin: disabled ? undefined : 24 },
				{ name: 'focus add-button', action: focusElem, margin: disabled ? 75 : 24, addButton: true },
				{ name: 'hover', action: hoverElem, margin: disabled ? undefined : 24 }
			].forEach(({ name, action, margin, addButton }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;" ?add-button="${addButton || false}">
							<d2l-list-item-button ?button-disabled="${disabled}">
								${simpleListItemContent}
							</d2l-list-item-button>
						</d2l-list>
					`);
					if (action) await action(elem.querySelector('d2l-list-item-button'));
					await expect(elem).to.be.golden({ margin });
				});
			});
		});
	});
});
