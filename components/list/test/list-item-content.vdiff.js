import '../list.js';
import '../list-item.js';
import '../list-item-content.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('list-item-content', () => {
	const clampSingleStyle = 'overflow: hidden; overflow-wrap: anywhere; text-overflow: ellipsis; white-space: nowrap;';
	const clampMultiStyle = '-webkit-box-orient: vertical; display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere;';
	function createContentList(opts) {
		const { contents, paddingType, contentStyle } = { contents: ['Item 1', 'Secondary Info for item 1', 'Supporting info for item 1'], ...opts };
		return html`
			<d2l-list style="width: 400px;">
				<d2l-list-item label="Item" padding-type="${ifDefined(paddingType)}">
					<d2l-list-item-content>
						<div style="${ifDefined(contentStyle)}">${contents[0]}</div>
						<div slot="secondary" style="${ifDefined(contentStyle)}">${contents[1]}</div>
						<div slot="supporting-info" style="${ifDefined(contentStyle)}">${contents[2]}</div>
					</d2l-list-item-content>
				</d2l-list-item>
			</d2l-list>
		`;
	}
	function createContents(prefix, includeLongText = true) {
		const longText = ' Lookout take a caulk rope\'s end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.';
		return [
			`${prefix} Primary text.${includeLongText ? longText : ''}`,
			`${prefix} Secondary Info.${includeLongText ? longText : ''}`,
			`${prefix} Supporting Info.${includeLongText ? longText : ''}`
		];
	}

	[
		{ name: 'all', template: createContentList() },
		{ name: 'no padding', template: createContentList({ paddingType: 'none' }) },
		{ name: 'long wrapping', template: createContentList({ contents: createContents('Overflow: wrap.') }) },
		{ name: 'long single line ellipsis', template: createContentList({ contentStyle: clampSingleStyle, contents: createContents('Overflow: single-line, ellipsis.') }) },
		{ name: 'long unbreakable single line ellipsis', template: createContentList({ contentStyle: clampSingleStyle, contents: ['a'.repeat(77), 'b'.repeat(77), 'c'.repeat(77)] }) },
		{ name: 'long single line ellipsis nested', template: createContentList({ contents: createContents('Overflow: single-line, ellipsis.').map(content => html`<div style="${clampSingleStyle}">${content}</div>`) }) },
		{ name: 'short single line ellipsis', template: createContentList({ contentStyle: clampSingleStyle, contents: createContents('Overflow: single-line, ellipsis.', false) }) },
		{ name: 'long multi line ellipsis', template: createContentList({ contentStyle: clampMultiStyle, contents: createContents('Overflow: multi-line, ellipsis.') }) }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});
});
