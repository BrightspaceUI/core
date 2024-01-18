import '../../button/button-icon.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import '../../link/link.js';
import '../../paging/pager-load-more.js';
import '../../tooltip/tooltip.js';
import '../demo/demo-list-nested-iterations-helper.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html, nextFrame, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

const simpleListItemContent = html`
	<d2l-list-item-content>
		<div>Item 1</div>
		<div slot="supporting-info">Secondary info for item 1</div>
	</d2l-list-item-content>
`;

function createSimpleList(opts) {
	const { color1, color2, extendSeparators, separatorType, addButton, addButtonText } = { extendSeparators: false, addButton: false, ...opts };
	return html`
		<d2l-list
			?extend-separators="${extendSeparators}"
			separators="${ifDefined(separatorType)}"
			style="width: 400px"
			?add-button="${addButton}"
			add-button-text="${ifDefined(addButtonText)}">
			<d2l-list-item label="1" color="${ifDefined(color1)}">Item 1</d2l-list-item>
			<d2l-list-item label="2" color="${ifDefined(color2)}">Item 2</d2l-list-item>
			<d2l-list-item>Item 3</d2l-list-item>
		</d2l-list>
	`;
}

describe('list', () => {
	describe('general', () => {
		it('simple', async() => {
			const elem = await fixture(createSimpleList({ color1: '#0000ff' }));
			await expect(elem).to.be.golden();
		});

		it('add-button', async() => {
			const elem = await fixture(createSimpleList({ addButton: true }));
			await expect(elem).to.be.golden();
		});

		it('add-button focus', async() => {
			const elem = await fixture(createSimpleList({ addButton: true }));
			await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
			await expect(elem).to.be.golden();
		});

		it('add-button add-button-text focus', async() => {
			const elem = await fixture(createSimpleList({ addButton: true, addButtonText: 'Custom Text' }));
			await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
			await expect(elem).to.be.golden();
		});

		it('add-button hover', async() => {
			const elem = await fixture(createSimpleList({ addButton: true }));
			await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
			await expect(elem).to.be.golden();
		});

		it('no-padding', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item label="1" padding-type="none">Item 1</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('no-padding add-button', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px" add-button>
					<d2l-list-item label="1" padding-type="none">Item 1</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});
	});

	describe('illustration', () => {
		it('default', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<div>Item 1</div>
						<div slot="illustration" style="background-color: blue; height: 400px; width: 400px;"></div>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});
	});

	describe('separators', () => {
		[ true, false ].forEach((addButton) => {
			[
				{ name: `default${addButton ? ' add-button' : ''}`, template: createSimpleList({ color1: '#0000ff', addButton }) },
				{ name: `none${addButton ? ' add-button' : ''}`, template: createSimpleList({ color1: '#00ff00', color2: '#00ff00', separatorType: 'none', addButton }) },
				{ name: `all${addButton ? ' add-button' : ''}`, template: createSimpleList({ separatorType: 'all', addButton }) },
				{ name: `between${addButton ? ' add-button' : ''}`, template: createSimpleList({ separatorType: 'between', addButton }) },
				{ name: `extended${addButton ? ' add-button' : ''}`, template: createSimpleList({ color1: '#00ff00', extendSeparators: true, addButton }) }
			].forEach(({ name, template }) => {
				it(name, async() => {
					const elem = await fixture(template);
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	describe('actions', () => {
		function createActionsList(opts) {
			const { extendSeparators } = { extendSeparators: false, ...opts };
			return html`
				<d2l-list ?extend-separators="${extendSeparators}" style="width: 400px;">
					<d2l-list-item>
						<div>Item 1</div>
						<div slot="actions">
							<d2l-link href="http://www.d2l.com">Action 1</d2l-link>
							<d2l-button-icon text="Action 2" icon="tier1:preview"></d2l-button-icon>
						</div>
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createActionsList() },
			{ name: 'extended separators', template: createActionsList({ extendSeparators: true }) },
			{ name: 'rtl', rtl: true, template: html`
				<d2l-list style="width: 400px;">
					<d2l-list-item>
						<div slot="illustration" style="background-color: blue; height: 400px; width: 400px;"></div>
						<div>Item 1</div>
						<div slot="actions">
							<d2l-button-icon text="Action 1" icon="tier1:preview"></d2l-button-icon>
							<d2l-button-icon text="Action 2" icon="tier1:more"></d2l-button-icon>
						</div>
					</d2l-list-item>
				</d2l-list>
			` },
		].forEach(({ name, template, rtl }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('pager', () => {
		[
			{ name: 'default', extendSeparators: false },
			{ name: 'extended separators', extendSeparators: true }
		].forEach(({ name, extendSeparators }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list ?extend-separators="${extendSeparators}" style="width: 400px;">
						<d2l-list-item label="Item 1" selectable key="1">
							<d2l-list-item-content>
								<div>Item 1</div>
								<div slot="supporting-info">Supporting info</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item label="Item 2" selectable key="2">
							<d2l-list-item-content>
								<div>Item 2</div>
								<div slot="supporting-info">Supporting info</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-pager-load-more slot="pager" has-more page-size="5"></d2l-pager-load-more>
					</d2l-list>
				`);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('item-content', () => {
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

	describe('href', () => {
		[
			{ name: 'default' },
			{ name: 'focus', action: focusElem, margin: 24 },
			{ name: 'hover', action: hoverElem, margin: 24 }
		].forEach(({ name, action, margin }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list style="width: 400px;">
						<d2l-list-item label="Item" href="http://www.d2l.com">
							${simpleListItemContent}
						</d2l-list-item>
					</d2l-list>
				`);
				if (action) await action(elem.querySelector('d2l-list-item'));
				await expect(elem).to.be.golden({ margin });
			});
		});
	});

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

	describe('selectable', () => {
		const selectableButtonList = html`
			<d2l-list style="width: 400px;">
				<d2l-list-item-button label="Item 3" selection-disabled selectable key="3">Item 3</d2l-list-item-button>
				<d2l-list-item-button label="Item 4" selection-disabled button-disabled selectable key="4">Item 4</d2l-list-item-button>
			</d2l-list>
		`;
		function createSelectableList(opts) {
			const { selected, addButton } = { selected: false, addButton: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?add-button="${addButton}">
					<d2l-list-item label="Item 1" selectable key="1" ?selected="${selected}" color="${ifDefined(!selected ? '#00ff00' : undefined)}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" selection-disabled selectable key="2" ?selected="${selected}" color="${ifDefined(selected ? '#00ff00' : undefined)}">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}
		function createSelectableContentList(opts) {
			const { skeleton, addButton } = { skeleton: false, addButton: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?add-button="${addButton}">
					<d2l-list-item label="Item 1" selectable key="1" ?skeleton="${skeleton}">
						${simpleListItemContent}
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'not selected', template: createSelectableList() },
			{ name: 'not selected focus', template: createSelectableList(), action: elem => focusElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'not selected hover', template: createSelectableList(), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'not selected add-button', template: createSelectableList({ addButton: true }) },
			{ name: 'selection-disabled hover', template: createSelectableList(), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
			{ name: 'button selection-disabled hover', template: selectableButtonList, action: elem => hoverElem(elem.querySelector('[key="3"]')), margin: 24 },
			{ name: 'button selection-disabled button-disabled hover', template: selectableButtonList, action: elem => hoverElem(elem.querySelector('[key="4"]')) },
			{ name: 'selected', template: createSelectableList({ selected: true }), margin: 24 },
			{ name: 'selected focus', template: createSelectableList({ selected: true }), action: elem => focusElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'selected hover', template: createSelectableList({ selected: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'selected add-button', template: createSelectableList({ selected: true, addButton: true }), margin: 24 },
			{ name: 'item-content', template: createSelectableContentList() },
			{ name: 'skeleton', template: createSelectableContentList({ skeleton: true }) },
			{ name: 'skeleton add-button', template: createSelectableContentList({ skeleton: true, addButton: true }) },
			{ name: 'extended separators', template: html`
				<d2l-list extend-separators style="width: 400px;">
					<d2l-list-item label="Item 1" selectable key="1">Item 1</d2l-list-item>
				</d2l-list>
			` }
		].forEach(({ name, template, action, margin }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
			});
		});
	});

	describe('selectable-href', () => {
		[
			{ name: 'hover href', action: hoverElem, margin: 24 },
			{ name: 'hover selection', action: elem => hoverElem(elem.shadowRoot.querySelector('[slot="control"]')), margin: 24 },
			{ name: 'hover secondary action', action: elem => hoverElem(elem.querySelector('d2l-button-icon')) },
		].forEach(({ name, action, margin }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list style="width: 400px;">
						<d2l-list-item href="http://www.d2l.com" selectable key="href" label="Introductory Earth Sciences">
							<d2l-list-item-content>Introductory Earth Sciences</d2l-list-item-content>
							<div slot="actions"><d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon></div>
						</d2l-list-item>
					</d2l-list>
				`);
				if (action) await action(elem.querySelector('[key="href"]'));
				await expect(elem).to.be.golden({ margin });
			});
		});
	});

	describe('controls', () => {
		function createListWithControls(opts) {
			const { color2, selectable, selected, selectAllPages } = { selectable: true, selected: [false, false], selectAllPages: false, ...opts };
			return html`
				<d2l-list item-count="${ifDefined(selectAllPages ? '50' : undefined)}" style="width: 400px;">
					<d2l-list-controls slot="controls" ?no-selection="${!selectable}" ?select-all-pages-allowed="${selectAllPages}" no-sticky>
						${selectable ? nothing : html`<d2l-button-subtle text="Action"></d2l-button-subtle>`}
					</d2l-list-controls>
					<d2l-list-item label="Item 1" key="1" ?selectable="${selectable}" ?selected="${selected[0]}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" key="2" color="${ifDefined(color2)}" ?selection-disabled="${selectable}" ?selectable="${selectable}" ?selected="${selected[1]}">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'not selectable', template: createListWithControls({ selectable: false }) },
			{ name: 'none selected', template: createListWithControls() },
			{ name: 'some selected', template: createListWithControls({ color2: '#00ff00', selected: [true, false] }), margin: 24 },
			{ name: 'all selected', template: createListWithControls({ selected: [true, true] }), margin: 24 },
			{ name: 'all selected pages', template: createListWithControls({ selectAllPages: true, selected: [true, true] }), margin: 24 },
		].forEach(({ name, template, margin }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden({ margin });
			});
		});

		[
			{ actionName: 'top', action: elem => elem.scrollTo(0, 0) },
			{ actionName: 'scrolled', action: elem => elem.scrollTo(0, 45) },
			{ actionName: 'scrolled hover', action: async(elem) => {
				elem.scrollTo(0, 45);
				await hoverElem(elem.querySelector('[key="1"] [slot="supporting-info"]'));
			} }
		].forEach(({ actionName, action }) => {
			[
				{ name: 'sticky' },
				{ name: 'sticky color', color1: '#ff0000' },
				{ name: 'sticky extended separators', extendSeparators: true },
				{ name: 'sticky extended separators color', color2: '#00ff00', extendSeparators: true },
				{ name: 'sticky add-button', addButton: true },
				{ name: 'sticky color add-button', color1: '#ff0000', addButton: true },
				{ name: 'sticky extended separators add-button', extendSeparators: true, addButton: true },
				{ name: 'sticky extended separators color add-button', color2: '#00ff00', extendSeparators: true, addButton: true }
			].forEach(({ name, color1, color2, extendSeparators = false, addButton = false }) => {
				it(`${name}-${actionName}`, async() => {
					const elem = await fixture(html`
						<div style="height: 200px; overflow: scroll; width: 400px;">
							<d2l-list style="padding: 0 20px;" ?extend-separators="${extendSeparators}" ?add-button="${addButton}">
								<d2l-list-controls slot="controls"></d2l-list-controls>
								<d2l-list-item label="Item 1" selectable key="1" color="${ifDefined(color1)}">
									<d2l-list-item-content>
										<div>Item 1</div>
										<div slot="supporting-info">Supporting info</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item label="Item 2" selectable key="2" color="${ifDefined(color2)}">
									<d2l-list-item-content>
										<div>Item 2</div>
										<div slot="supporting-info">Supporting info</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item label="Item 3" selectable key="3">
									<d2l-list-item-content>
										<div>Item 3</div>
										<div slot="supporting-info">Supporting info</div>
									</d2l-list-item-content>
								</d2l-list-item>
							</d2l-list>
						</div>
					`);
					await action(elem);
					await expect(elem).to.be.golden();
				});
			});

			it('sticky add-button focus scrolled', async() => {
				const elem = await fixture(html`
					<div style="height: 200px; overflow: scroll; width: 400px;">
						<d2l-list style="padding: 0 20px;" add-button>
							<d2l-list-controls slot="controls"></d2l-list-controls>
							<d2l-list-item label="Item 1" selectable key="1">
								<d2l-list-item-content>
									<div>Item 1</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item label="Item 2" selectable key="2">
								<d2l-list-item-content>
									<div>Item 2</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item label="Item 3" selectable key="3">
								<d2l-list-item-content>
									<div>Item 3</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item label="Item 4" selectable key="4">
								<d2l-list-item-content>
									<div>Item 4</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</div>
				`);
				const addButton = elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add');
				await focusElem(addButton);
				await elem.scrollTo(0, 90);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('draggable', () => {
		function createDraggableList(opts) {
			const { color1, color2, extendSeparators, handleOnly, selectable, addButton } = { extendSeparators: false, handleOnly: false, selectable: false, addButton: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?extend-separators="${extendSeparators}" ?add-button="${addButton}">
					<d2l-list-item label="Item 1" color="${ifDefined(color1)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="1" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" color="${ifDefined(color2)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="2" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createDraggableList() },
			{ name: 'focus', template: createDraggableList(), action: elem => focusElem(elem.querySelector('[key="1"]')) },
			{ name: 'hover', template: createDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'add-button', template: createDraggableList({ addButton: true }) },
			{ name: 'add-button focus', template: createDraggableList({ addButton: true }), action: elem => focusElem(elem.querySelector('[key="1"]')) },
			{ name: 'add-button hover', template: createDraggableList({ addButton: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'color hover', template: createDraggableList({ color1: '#ff0000' }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'hover list item', template: createDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'hover outside control', template: createDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')) },
			{ name: 'drag-target-handle-only hover list item', template: createDraggableList({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'drag-target-handle-only hover outside control', template: createDraggableList({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')) },
			{ name: 'selectable', template: createDraggableList({ selectable: true }) },
			{ name: 'selectable focus', template: createDraggableList({ selectable: true }), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
			{ name: 'selectable hover', template: createDraggableList({ selectable: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'color selectable focus', template: createDraggableList({ color1: '#ff0000aa', selectable: true }), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
			{ name: 'color selectable hover', template: createDraggableList({ color1: '#ff0000aa', selectable: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'extended separators', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true }) },
			{ name: 'extended separators hover', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
			{ name: 'extended separators add-button', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true, addButton: true }) },
			{ name: 'extended separators add-button hover', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true, addButton: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('breakpoints', () => {
		[
			{ name: '842', width: 900, color: '#00ff00' },
			{ name: '636', width: 700 },
			{ name: '580', width: 600 },
			{ name: '0', width: 490 },
			{ name: 'list', width: 900, breakpoints: '[1170, 391, 0, 0]', color: '#00ff00', largeSecondItem: true }
		].forEach(({ name, width, breakpoints, color, largeSecondItem = false }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list breakpoints="${ifDefined(breakpoints)}" style="width: ${width}px;">
						<d2l-list-item label="Item 1" color="${ifDefined(color)}">
							<div style="background: blue; height: 400px; width: 400px;" slot="illustration"></div>
							<d2l-list-item-content>
								<div>Introductory Pirate Ipsum</div>
								<div slot="supporting-info">Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters.</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item label="Item 2">
							<div style="background: blue; ${largeSecondItem ? 'height: 400px; width: 400px;' : 'height: 42px; width: 42px;'}" slot="illustration"></div>
							<d2l-list-item-content>
								<div>Introductory Pirate Ipsum</div>
								<div slot="supporting-info">Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters.</div>
							</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
				`, { viewport: { width: 1000 } });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('action types', () => {
		const listWithDropdownTooltip = html`
			<d2l-list style="width: 400px;">
				<d2l-list-item>
					Item 1
					<div slot="actions">
						<d2l-dropdown id="open-down">
							<button id="dropdown-btn-down" class="d2l-dropdown-opener">Open</button>
							<d2l-tooltip class="vdiff-include" for="dropdown-btn-down" position="bottom">Cookie pie apple pie</d2l-tooltip>
							<d2l-dropdown-content class="vdiff-include">donut gummies</d2l-dropdown-content>
						</d2l-dropdown>
					</div>
				</d2l-list-item>
				<d2l-list-item>Item 2</d2l-list-item>
				<d2l-list-item>Item 3</d2l-list-item>
			</d2l-list>
		`;

		it('dropdown open down', async() => {
			const elem = await fixture(listWithDropdownTooltip);
			const dropdown = elem.querySelector('d2l-dropdown');
			setTimeout(() => dropdown.toggleOpen());
			await oneEvent(dropdown, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});

		it('tooltip open down', async() => {
			const elem = await fixture(listWithDropdownTooltip);
			const tooltip = elem.querySelector('d2l-tooltip');
			setTimeout(() => tooltip.show());
			await oneEvent(tooltip, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});
	});

	describe('nested', () => {
		function createNestedList(opts) {
			const { color1, color3, selected } = { selected: [false, false, false], ...opts };
			return html`
				<d2l-list style="width: 600px;">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item selectable label="L1-1" key="L1-1">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
						</d2l-list-item-content>
						<div slot="actions">
							<button>action 1</button>
							<button>action 2</button>
						</div>
						<d2l-list slot="nested" separators="between">
							<d2l-list-item selectable ?selected="${selected[0]}" color="${ifDefined(color1)}" label="L2-1" key="L2-1">
								<d2l-list-item-content>
									<div>Level 2, Item 1</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item selectable label="L2-2" key="L2-2">
								<d2l-list-item-content>
									<div>Level 2, Item 2</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
								<d2l-list slot="nested" separators="between">
									<d2l-list-item selectable ?selected="${selected[1]}" label="L3-1" key="L3-1">
										<d2l-list-item-content>
											<div>Level 3, Item 1</div>
											<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item selectable ?selected="${selected[2]}" color="${ifDefined(color3)}" label="L3-2" key="L3-2">
										<d2l-list-item-content>
											<div>Level 3, Item 2</div>
											<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
										</d2l-list-item-content>
									</d2l-list-item>
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'none-selected', template: createNestedList({ color1: '#00ff00' }) },
			{ name: 'some-selected', template: createNestedList({ selected: [false, false, true], color3: '#00ff00' }) },
			{ name: 'all-selected', template: createNestedList({ selected: [true, true, true] }) }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden({ margin: 24 });
			});
		});
	});

	describe('expand-collapse', () => {
		function createExpandableList(opts) {
			const { color1, color2, color3, draggable, expanded, nested, nestedMultiple, secondTopLevelItem, selectable, skeleton } = {
				draggable: false,
				expanded: false,
				nested: true,
				nestedMultiple: false,
				selectable: false,
				secondTopLevelItem: false,
				skeleton: false,
				...opts };
			return html`
				<d2l-list style="width: 600px;">
					<d2l-list-item ?draggable="${draggable}" expandable ?expanded="${expanded}" ?selectable="${selectable}" ?skeleton="${skeleton}" color="${ifDefined(color1)}" label="L1-1" key="L1-1">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Supporting text for top level list item</div>
						</d2l-list-item-content>
						${nested ? html`
							<d2l-list slot="nested">
								<d2l-list-item ?draggable="${draggable}" ?selectable="${selectable}" color="${ifDefined(color2)}" label="L2-1" key="L2-1">
									<d2l-list-item-content>
										<div>Level 2, Item 1</div>
										<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item ?draggable="${draggable}" expandable ?expanded="${expanded}" ?selectable="${selectable}" color="${ifDefined(color3)}" label="L2-2" key="L2-2">
									<d2l-list-item-content>
										<div>Level 2, Item 2</div>
										<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
									</d2l-list-item-content>
									<d2l-list slot="nested">
										<d2l-list-item ?draggable="${draggable}" ?selectable="${selectable}" label="L3-1" key="L3-1">
											<d2l-list-item-content>
												<div>Level 3, Item 1</div>
											</d2l-list-item-content>
										</d2l-list-item>
										<d2l-list-item ?draggable="${draggable}" ?selectable="${selectable}" label="L3-2" key="L3-2">
											<d2l-list-item-content>
												<div>Level 3, Item 2</div>
											</d2l-list-item-content>
										</d2l-list-item>
									</d2l-list>
								</d2l-list-item>
								${nestedMultiple ? html`
									<d2l-list-item expandable ?expanded="${expanded}" label="L2-3" key="L2-3">
										<d2l-list-item-content>
											<div>Level 2, Item 3</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
										<d2l-list slot="nested">
											<d2l-list-item label="L3-1b" key="L3-1b">
												<d2l-list-item-content>
													<div>Level 3, Item 1b</div>
												</d2l-list-item-content>
											</d2l-list-item>
											<d2l-list-item label="L3-2b" key="L3-2b">
												<d2l-list-item-content>
													<div>Level 3, Item 2b</div>
												</d2l-list-item-content>
											</d2l-list-item>
										</d2l-list>
									</d2l-list-item>
								` : nothing}
							</d2l-list>
						` : nothing}
					</d2l-list-item>
					${secondTopLevelItem ? html`
						<d2l-list-item ?skeleton="${skeleton}" label="L1-2" key="L1-2">
							<d2l-list-item-content>
								<div>Level 1, Item 2</div>
								<div slot="supporting-info">Supporting text for second list item</div>
							</d2l-list-item-content>
						</d2l-list-item>
					` : nothing}
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createExpandableList({ nested: false }) },
			{ name: 'skeleton', template: createExpandableList({ color1: '#ff0000', nested: false, secondTopLevelItem: true, skeleton: true }) },
			{ name: 'default expanded', template: createExpandableList({ expanded: true }) },
			{ name: 'selectable', template: createExpandableList({ expanded: true, selectable: true }) },
			{ name: 'draggable', template: createExpandableList({ color2: '#0000ff', draggable: true, expanded: true }) },
			{ name: 'selectable draggable', template: createExpandableList({ color3: '#129044', draggable: true, expanded: true, selectable: true }) },
			{ name: 'selectable draggable rtl', rtl: true, template: createExpandableList({ color3: '#129044', draggable: true, expanded: true, selectable: true }) },
			{ name: 'default expanded multiple nested lists', template: createExpandableList({ color3: '#ff0000', expanded: true, nestedMultiple: true }) },
			{ name: 'button focus', template: createExpandableList({ nested: false }), action: elem => focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-icon')) },
			{ name: 'remove color', template: createExpandableList({ color3: '#129044', draggable: true, expanded: true, selectable: true }), action: async(elem) => {
				elem.querySelector('[key="L2-2"]').color = undefined;
				await nextFrame();
			} },
			{ name: 'add color', template: createExpandableList({ draggable: true, expanded: true, selectable: true }), action: async(elem) => {
				elem.querySelector('[key="L3-1"]').color = '#ff0000';
				await nextFrame();
			} }
		].forEach(({ name, template, action, rtl }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl });
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('color', () => {
		function createColorList(opts) {
			const { controls, draggable, nestedMultiple, selectable } = {
				controls: true,
				draggable: false,
				nestedMultiple: false,
				selectable: false,
				...opts };
			return html`
				<d2l-list extend-separators style="width: 600px;">
					${controls ? html`
						<d2l-list-controls slot="controls">
							<d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
							<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
						</d2l-list-controls>
					` : nothing}
					<d2l-list-item ?selectable="${selectable}" key="L1-1" label="Label for L1-1" ?draggable="${draggable}">
						<d2l-list-item-content>
							<div>Biology (L1)</div>
						</d2l-list-item-content>
					</d2l-list-item>
					<d2l-list-item ?selectable="${selectable}" key="L1-2" label="Label for L1-2" expandable expanded color="#00ff00ab" ?draggable="${draggable}">
						<d2l-list-item-content>
							<div>Earth Sciences (L1)</div>
							<div slot="supporting-info">Earth science or geoscience includes all fields of natural science related to planet Earth. This is a branch of science dealing with the physical and chemical constitution of Earth and its atmosphere. Earth science can be considered to be a branch of planetary science, but with a much older history.</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid separators="all" extend-separators>
							<d2l-list-item ?selectable="${selectable}" key="L2-1" label="Label for L2-1" color="#ffba59" ?expandable="${nestedMultiple}" ?draggable="${draggable}">
								<d2l-list-item-content>
									<div>Introductory Earth Sciences (L2)</div>
									<div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain building, glaciation and weathering. Students will gain an appreciation of how these processes have controlled the evolution of our planet and the role of geology in meeting society's current and future demand for sustainable energy and mineral resources.</div>
								</d2l-list-item-content>
								${nestedMultiple ? html`
									<d2l-list slot="nested" grid separators="all">
										<d2l-list-item ?selectable="${selectable}" key="L3-1" label="Label for L3-1" color="#ffba59" ?draggable="${draggable}">
											<d2l-list-item-content>
												<div>Glaciation (L3)</div>
												<div slot="supporting-info">Supporting Info</div>
											</d2l-list-item-content>
										</d2l-list-item>
									</d2l-list>
								` : nothing}
							</d2l-list-item>
							${nestedMultiple ? html`
								<d2l-list-item ?selectable="${selectable}" key="L2-2" label="Label for L2-2" color="#ffba59" ?draggable="${draggable}">
									<d2l-list-item-content>
										<div>GlaciationB (L2)</div>
										<div slot="supporting-info">Supporting Info</div>
									</d2l-list-item-content>
								</d2l-list-item>
							` : nothing}
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'extend separators nested', template: createColorList({ controls: false }) },
			{ name: 'extend separators nested selectable', template: createColorList({ selectable: true }) },
			{ name: 'extend separators nested selectable hover', template: createColorList({ selectable: true }), action: elem => hoverElem(elem.querySelector('[key="L1-2"]')) },
			{ name: 'extend separators selectable draggable', template: createColorList({ draggable: true, selectable: true, nestedMultiple: true }) },
			{ name: 'extend separators selectable draggable hover', template: createColorList({ draggable: true, selectable: true, nestedMultiple: true }), action: elem => hoverElem(elem.querySelector('[key="L1-2"]')) }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});
});

describe('list-nested', () => {
	[true, false].forEach(rtl => {
		[
			{ name: 'all-iterations-non-draggable', draggable: false, media: 'screen' },
			{ name: 'all-iterations-draggable', draggable: true, media: 'screen' },
			{ name: 'all-iterations-draggable-force-show', draggable: true, media: 'print' }
		].forEach(({ name, draggable, media }) => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(html`<d2l-demo-list-nested-iterations-helper ?is-draggable="${draggable}"></d2l-demo-list-nested-iterations-helper>`,
					{ media, rtl, viewport: { width: 1300, height: 7000 } }
				);
				await nextFrame();
				await expect(elem).to.be.golden();
			}).timeout(30000);
		});
	});
});
