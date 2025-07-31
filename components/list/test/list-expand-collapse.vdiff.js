import '../../button/button.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import '../../tooltip/tooltip.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

describe('list', () => {
	describe('expand-collapse', () => {
		function createExpandableList(opts) {
			const { color1, color2, color3, draggable, expanded, nested, nestedMultiple, secondTopLevelItem, selectable, skeleton, addButton } = {
				color1: undefined,
				color2: undefined,
				color3: undefined,
				draggable: false,
				expanded: false,
				nested: true,
				nestedMultiple: false,
				secondTopLevelItem: false,
				selectable: false,
				skeleton: false,
				addButton: false,
				...opts };
			return html`
				<d2l-list style="width: 600px;" ?add-button="${addButton}">
					<d2l-list-item ?draggable="${draggable}" expandable ?expanded="${expanded}" ?selectable="${selectable}" ?skeleton="${skeleton}" color="${ifDefined(color1)}" label="L1-1" key="L1-1">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Supporting text for top level list item</div>
						</d2l-list-item-content>
						${nested ? html`
							<d2l-list slot="nested" ?add-button="${addButton}">
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
									<d2l-list slot="nested" ?add-button="${addButton}">
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
										<d2l-list slot="nested" ?add-button="${addButton}">
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
			{ name: 'default expanded multiple nested lists', template: createExpandableList({ color3: '#ff0000', expanded: true, nestedMultiple: true }) },
			{ name: 'button focus', template: createExpandableList({ nested: false }), action: elem => focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-icon')) },
		].forEach(({ name, template, action, rtl, margin = undefined }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl });
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
			});
		});

		describe('complex nested structures', () => {
			[
				{ name: 'default', action: null },
				{ name: 'hover', action: (elem) => hoverElem(elem.querySelector('d2l-list-item')) },
				{ name: 'focus', action: (elem) => focusElem(elem.querySelector('d2l-list-item')) }
			].forEach(({ name, action }) => {
				it(`complex-nested ${name}`, async() => {
					const template = html`
						<d2l-list style="width: 600px;">
							<d2l-list-item expandable expanded label="Item 1" key="L1-1">
								<d2l-list-item-content>
									<div>Level 1, Item 1</div>
								</d2l-list-item-content>
								<d2l-list slot="nested">
									<d2l-list-item expandable expanded label="L2-1" key="L2-1">
										<d2l-list-item-content>
											<div>Level 2, Item 1</div>
										</d2l-list-item-content>
										<d2l-list slot="nested">
											<d2l-list-item label="L3-1" key="L3-1">
												<d2l-list-item-content>
													<div>Level 3, Item 1</div>
												</d2l-list-item-content>
											</d2l-list-item>
										</d2l-list>
									</d2l-list-item>
									<d2l-list-item label="L2-2" key="L2-2">
										<d2l-list-item-content>
											<div>Level 2, Item 2</div>
										</d2l-list-item-content>
									</d2l-list-item>
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					`;
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});
	});
});
