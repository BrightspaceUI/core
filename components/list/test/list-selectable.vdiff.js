import '../../button/button-icon.js';
import '../../selection/selection-action.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

function createOffColorBackground(template, { colorVar = null, colorHex = '#FFBBCC' } = {}) {
	const backgroundColor = colorVar ? `var(--d2l-color-${colorVar})` : colorHex;
	const style = `background-color: ${backgroundColor}; padding: 1rem; box-sizing: border-box; width: fit-content;`;
	return html`
		<div style=${style}>
			${template}
		</div>
	`;
}

const simpleListItemContent = html`
	<d2l-list-item-content>
		<div>Item 1</div>
		<div slot="supporting-info">Secondary info for item 1</div>
	</d2l-list-item-content>
`;

describe('list', () => {
	describe('selectable', () => {
		const selectableButtonList = html`
			<d2l-list style="width: 400px;">
				<d2l-list-item-button label="Item 3" selection-disabled selectable key="3">Item 3</d2l-list-item-button>
				<d2l-list-item-button label="Item 4" selection-disabled button-disabled selectable key="4">Item 4</d2l-list-item-button>
			</d2l-list>
		`;
		function createSelectableList(opts) {
			const { selected, addButton, selectionDisabled } = { selected: false, addButton: false, selectionDisabled: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?add-button="${addButton}">
					<d2l-list-item label="Item 1" selectable key="1" ?selected="${selected}" color="${ifDefined(!selected ? '#00ff00' : undefined)}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" ?selection-disabled="${selectionDisabled}" selectable key="2" color="${ifDefined(selected ? '#00ff00' : undefined)}">Item 2</d2l-list-item>
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
			{ name: 'selection-disabled hover', template: createSelectableList({ selectionDisabled: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
			{ name: 'button selection-disabled hover', template: selectableButtonList, action: elem => hoverElem(elem.querySelector('[key="3"]')), margin: 24 },
			{ name: 'button selection-disabled button-disabled hover', template: selectableButtonList, action: elem => hoverElem(elem.querySelector('[key="4"]')) },
			{ name: 'selected', template: createSelectableList({ selected: true }), margin: 24 },
			{ name: 'selected focus', template: createSelectableList({ selected: true }), action: elem => focusElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'selected hover', template: createSelectableList({ selected: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'selected add-button', template: createSelectableList({ selected: true, addButton: true }), margin: 24 },
			{ name: 'selected focus sibling', template: createSelectableList({ selected: true }), action: elem => focusElem(elem.querySelector('[key="2"]')), margin: 24 },
			{ name: 'selected hover sibling', template: createSelectableList({ selected: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')), margin: 24 },
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
			it(`${name} off-color background`, async() => {
				const elem = await fixture(createOffColorBackground(template));
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
			});
		});

		describe('href', () => {
			const selectableHrefList = html`
				<d2l-list style="width: 400px;">
					<d2l-list-item href="http://www.d2l.com" selectable key="href" label="Introductory Earth Sciences">
						<d2l-list-item-content>Introductory Earth Sciences</d2l-list-item-content>
						<div slot="actions"><d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon></div>
					</d2l-list-item>
				</d2l-list>`;
			[
				{ name: 'hover href', template: selectableHrefList, action: hoverElem, margin: 24 },
				{ name: 'hover selection', template: selectableHrefList, action: elem => hoverElem(elem.shadowRoot.querySelector('[slot="control"]')), margin: 24 },
				{ name: 'hover secondary action', template: selectableHrefList, action: elem => hoverElem(elem.querySelector('d2l-button-icon')) },
			].forEach(({ name, template, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem.querySelector('[key="href"]'));
					await expect(elem).to.be.golden({ margin });
				});
				it(`${name} off-color background`, async() => {
					const elem = await fixture(createOffColorBackground(template));
					if (action) await action(elem.querySelector('[key="href"]'));
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('controls', () => {
			function createListWithControls(opts) {
				const { actions, color2, extendSeparators, selected, selectAllPages } = {
					actions: false,
					extendSeparators: false,
					selected: [false, false],
					selectAllPages: false,
					...opts
				};
				return html`
					<d2l-list item-count="${ifDefined(selectAllPages ? '50' : undefined)}" ?extend-separators="${extendSeparators}" style="width: 400px;">
						<d2l-list-controls slot="controls" ?select-all-pages-allowed="${selectAllPages}" no-sticky>
							${actions ? html`
								<d2l-selection-action text="Delete" icon="tier1:delete"></d2l-selection-action>
								<d2l-selection-action text="Edit" icon="tier1:edit"></d2l-selection-action>
							` : nothing}
						</d2l-list-controls>
						<d2l-list-item label="Item 1" key="1" selectable ?selected="${selected[0]}">Item 1</d2l-list-item>
						<d2l-list-item label="Item 2" key="2" color="${ifDefined(color2)}" selection-disabled selectable ?selected="${selected[1]}">Item 2</d2l-list-item>
					</d2l-list>
				`;
			}

			[
				{ name: 'none selected no-actions', template: createListWithControls() },
				{ name: 'some selected', template: createListWithControls({ color2: '#00ff00', selected: [true, false] }), margin: 24 },
				{ name: 'all selected', template: createListWithControls({ selected: [true, true] }), margin: 24 },
				{ name: 'all selected pages', template: createListWithControls({ selectAllPages: true, selected: [true, true] }), margin: 24 },
				{ name: 'actions', template: createListWithControls({ actions: true }) },
				{ name: 'actions color', template: createListWithControls({ actions: true, color2: '#00ff00' }) },
				{ name: 'actions extend', template: createListWithControls({ actions: true, extendSeparators: true }) },
				{ name: 'actions extend color', template: createListWithControls({ actions: true, color2: '#00ff00', extendSeparators: true }) },
			].forEach(({ name, template, margin }) => {
				it(name, async() => {
					const elem = await fixture(template);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});
	});
});
