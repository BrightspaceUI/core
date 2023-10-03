import '../demo/demo-list-nested-iterations-helper.js';
import '../list.js';
import '../list-item.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('list', () => {
	describe('draggable', () => {
		function createDraggableFixture(opts) {
			const { color1, color2, extendSeparators, handleOnly, selectable } = { extendSeparators: false, handleOnly: false, selectable: false, ...opts };
			return html`
				<d2l-list style="width: 400px" ?extend-separators="${extendSeparators}">
					<d2l-list-item label="Item 1" color="${ifDefined(color1)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="1" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" color="${ifDefined(color2)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="2" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createDraggableFixture() },
			{ name: 'focus', template: createDraggableFixture(), action: elem => focusElem(elem.querySelector('[key="1"]')) },
			{ name: 'hover', template: createDraggableFixture(), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'color hover', template: createDraggableFixture({ color1: '#ff0000' }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'hover list item', template: createDraggableFixture(), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'hover outside control', template: createDraggableFixture(), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')) },
			{ name: 'drag-target-handle-only hover list item', template: createDraggableFixture({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'drag-target-handle-only hover outside control', template: createDraggableFixture({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')) },
			{ name: 'selectable', template: createDraggableFixture({ selectable: true }) },
			{ name: 'selectable focus', template: createDraggableFixture({ selectable: true }), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
			{ name: 'selectable hover', template: createDraggableFixture({ selectable: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'color selectable focus', template: createDraggableFixture({ color1: '#ff0000aa', selectable: true }), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
			{ name: 'color selectable hover', template: createDraggableFixture({ color1: '#ff0000aa', selectable: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'extended separators', template: createDraggableFixture({ color2: '#00ff00', extendSeparators: true, selectable: true }) },
			{ name: 'extended separators hover', template: createDraggableFixture({ color2: '#00ff00', extendSeparators: true, selectable: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
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
				const elem = await fixture(html`<d2l-demo-list-nested-iterations-helper ?draggable="${draggable}"></d2l-demo-list-nested-iterations-helper>`,
					{ media, rtl, viewport: { width: 1300, height: 7000 } }
				);
				await expect(elem).to.be.golden();
			}).timeout(10000);
		});
	});
});
