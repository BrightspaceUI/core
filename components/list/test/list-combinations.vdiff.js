import '../../button/button.js';
import '../../button/button-icon.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import '../../selection/selection-action.js';
import '../../tooltip/tooltip.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html, nextFrame, oneEvent } from '@brightspace-ui/testing';
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

describe('list', () => {
	describe('combinations', () => {

		describe('selectable + draggable', () => {
			function createSelectableDraggableList(opts) {
				const { color1, color2, extendSeparators, handleOnly } = { extendSeparators: false, handleOnly: false, ...opts };
				return html`
					<d2l-list style="width: 400px;" ?extend-separators="${extendSeparators}">
						<d2l-list-item label="Item 1" color="${ifDefined(color1)}" draggable ?drag-target-handle-only="${handleOnly}" selectable key="1" href="http://www.d2l.com">Item 1</d2l-list-item>
						<d2l-list-item label="Item 2" color="${ifDefined(color2)}" draggable ?drag-target-handle-only="${handleOnly}" selectable key="2" href="http://www.d2l.com">Item 2</d2l-list-item>
					</d2l-list>
				`;
			}

			[
				{ name: 'default', template: createSelectableDraggableList() },
				{ name: 'off-color background', template: createOffColorBackground(createSelectableDraggableList()) },
				{ name: 'focus', template: createSelectableDraggableList(), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')), margin: 24 },
				{ name: 'focus off-color background', template: createOffColorBackground(createSelectableDraggableList()), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
				{ name: 'hover', template: createSelectableDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
				{ name: 'hover off-color background', template: createOffColorBackground(createSelectableDraggableList()), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
				{ name: 'color focus', template: createSelectableDraggableList({ color1: '#ff0000aa' }), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')), margin: 24 },
				{ name: 'color focus off-color background', template: createOffColorBackground(createSelectableDraggableList({ color1: '#ff0000aa' })), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
				{ name: 'color hover', template: createSelectableDraggableList({ color1: '#ff0000aa' }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
				{ name: 'color hover off-color background', template: createOffColorBackground(createSelectableDraggableList({ color1: '#ff0000aa' })), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
				{ name: 'extended separators', template: createSelectableDraggableList({ color2: '#00ff00', extendSeparators: true }) },
				{ name: 'extended separators hover', template: createSelectableDraggableList({ color2: '#00ff00', extendSeparators: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
			].forEach(({ name, template, action, margin = undefined }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('expandable + selectable', () => {
			function createExpandableSelectableList(opts) {
				const { color1, color2, color3, expanded, nested, nestedMultiple } = {
					expanded: false,
					nested: true,
					nestedMultiple: false,
					...opts
				};
				return html`
					<d2l-list style="width: 600px;">
						<d2l-list-item expandable ?expanded="${expanded}" selectable color="${ifDefined(color1)}" label="L1-1" key="L1-1">
							<d2l-list-item-content>
								<div>Level 1, Item 1</div>
								<div slot="supporting-info">Supporting text for top level list item</div>
							</d2l-list-item-content>
							${nested ? html`
								<d2l-list slot="nested">
									<d2l-list-item selectable color="${ifDefined(color2)}" label="L2-1" key="L2-1">
										<d2l-list-item-content>
											<div>Level 2, Item 1</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item expandable ?expanded="${expanded}" selectable color="${ifDefined(color3)}" label="L2-2" key="L2-2">
										<d2l-list-item-content>
											<div>Level 2, Item 2</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
										<d2l-list slot="nested">
											<d2l-list-item selectable label="L3-1" key="L3-1">
												<d2l-list-item-content>
													<div>Level 3, Item 1</div>
												</d2l-list-item-content>
											</d2l-list-item>
											<d2l-list-item selectable label="L3-2" key="L3-2">
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
					</d2l-list>
				`;
			}

			[
				{ name: 'expanded', template: createExpandableSelectableList({ expanded: true }) },
			].forEach(({ name, template }) => {
				it(name, async() => {
					const elem = await fixture(template);
					await expect(elem).to.be.golden();
				});
			});
		});

		describe('expandable + draggable', () => {
			function createExpandableDraggableList(opts) {
				const { color1, color2, color3, expanded, nested } = {
					expanded: false,
					nested: true,
					...opts
				};
				return html`
					<d2l-list style="width: 600px;">
						<d2l-list-item draggable expandable ?expanded="${expanded}" color="${ifDefined(color1)}" label="L1-1" key="L1-1">
							<d2l-list-item-content>
								<div>Level 1, Item 1</div>
								<div slot="supporting-info">Supporting text for top level list item</div>
							</d2l-list-item-content>
							${nested ? html`
								<d2l-list slot="nested">
									<d2l-list-item draggable color="${ifDefined(color2)}" label="L2-1" key="L2-1">
										<d2l-list-item-content>
											<div>Level 2, Item 1</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item draggable expandable ?expanded="${expanded}" color="${ifDefined(color3)}" label="L2-2" key="L2-2">
										<d2l-list-item-content>
											<div>Level 2, Item 2</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
										<d2l-list slot="nested">
											<d2l-list-item draggable label="L3-1" key="L3-1">
												<d2l-list-item-content>
													<div>Level 3, Item 1</div>
												</d2l-list-item-content>
											</d2l-list-item>
											<d2l-list-item draggable label="L3-2" key="L3-2">
												<d2l-list-item-content>
													<div>Level 3, Item 2</div>
												</d2l-list-item-content>
											</d2l-list-item>
										</d2l-list>
									</d2l-list-item>
								</d2l-list>
							` : nothing}
						</d2l-list-item>
					</d2l-list>
				`;
			}

			[
				{ name: 'expanded', template: createExpandableDraggableList({ color2: '#0000ff', expanded: true }) },
				{ name: 'expanded focus nested', template: createExpandableDraggableList({ color2: '#0000ff', expanded: true }), action: elem => focusElem(elem.querySelectorAll('d2l-list-item')[2].shadowRoot.querySelector('d2l-button-icon')), margin: 24 },
			].forEach(({ name, template, action, margin = undefined }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('expandable + draggable + selectable', () => {
			function createExpandableDraggableSelectableList(opts) {
				const { color1, color2, color3, expanded, nested } = {
					expanded: false,
					nested: true,
					...opts
				};
				return html`
					<d2l-list style="width: 600px;">
						<d2l-list-item draggable expandable ?expanded="${expanded}" selectable color="${ifDefined(color1)}" label="L1-1" key="L1-1">
							<d2l-list-item-content>
								<div>Level 1, Item 1</div>
								<div slot="supporting-info">Supporting text for top level list item</div>
							</d2l-list-item-content>
							${nested ? html`
								<d2l-list slot="nested">
									<d2l-list-item draggable selectable color="${ifDefined(color2)}" label="L2-1" key="L2-1">
										<d2l-list-item-content>
											<div>Level 2, Item 1</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item draggable expandable ?expanded="${expanded}" selectable color="${ifDefined(color3)}" label="L2-2" key="L2-2">
										<d2l-list-item-content>
											<div>Level 2, Item 2</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
										<d2l-list slot="nested">
											<d2l-list-item draggable selectable label="L3-1" key="L3-1">
												<d2l-list-item-content>
													<div>Level 3, Item 1</div>
												</d2l-list-item-content>
											</d2l-list-item>
											<d2l-list-item draggable selectable label="L3-2" key="L3-2">
												<d2l-list-item-content>
													<div>Level 3, Item 2</div>
												</d2l-list-item-content>
											</d2l-list-item>
										</d2l-list>
									</d2l-list-item>
								</d2l-list>
							` : nothing}
						</d2l-list-item>
					</d2l-list>
				`;
			}

			[
				{ name: 'expanded', template: createExpandableDraggableSelectableList({ color3: '#129044', expanded: true }) },
				{ name: 'expanded rtl', rtl: true, template: createExpandableDraggableSelectableList({ color3: '#129044', expanded: true }) },
				{ name: 'remove color', template: createExpandableDraggableSelectableList({ color3: '#129044', expanded: true }), action: async(elem) => {
					elem.querySelector('[key="L2-2"]').color = undefined;
					await nextFrame();
				} },
				{ name: 'add color', template: createExpandableDraggableSelectableList({ expanded: true }), action: async(elem) => {
					elem.querySelector('[key="L3-1"]').color = '#ff0000';
					await nextFrame();
				} }
			].forEach(({ name, template, action, rtl, margin = undefined }) => {
				it(name, async() => {
					const elem = await fixture(template, { rtl });
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('add-button + draggable', () => {
			function createDraggableListWithAddButton(opts) {
				const { color1, color2, extendSeparators, handleOnly, selectable } = { extendSeparators: false, handleOnly: false, selectable: false, ...opts };
				return html`
					<d2l-list style="width: 400px;" ?extend-separators="${extendSeparators}" add-button>
						<d2l-list-item label="Item 1" color="${ifDefined(color1)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="1" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 1</d2l-list-item>
						<d2l-list-item label="Item 2" color="${ifDefined(color2)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="2" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 2</d2l-list-item>
					</d2l-list>
				`;
			}

			[
				{ name: 'default', template: createDraggableListWithAddButton() },
				{ name: 'focus', template: createDraggableListWithAddButton(), action: elem => focusElem(elem.querySelector('[key="2"]')), margin: 24 },
				{ name: 'hover', template: createDraggableListWithAddButton(), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
				{ name: 'extended separators', template: createDraggableListWithAddButton({ color2: '#00ff00', extendSeparators: true, selectable: true }) },
				{ name: 'extended separators hover', template: createDraggableListWithAddButton({ color2: '#00ff00', extendSeparators: true, selectable: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
			].forEach(({ name, template, action, margin = undefined }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('add-button + expandable', () => {
			function createExpandableListWithAddButton(opts) {
				const { color1, color2, color3, draggable, expanded, nested, nestedMultiple, selectable, skeleton } = {
					draggable: false,
					expanded: false,
					nested: true,
					nestedMultiple: false,
					selectable: false,
					skeleton: false,
					...opts };
				return html`
					<d2l-list style="width: 600px;" add-button>
						<d2l-list-item ?draggable="${draggable}" expandable ?expanded="${expanded}" ?selectable="${selectable}" ?skeleton="${skeleton}" color="${ifDefined(color1)}" label="L1-1" key="L1-1">
							<d2l-list-item-content>
								<div>Level 1, Item 1</div>
								<div slot="supporting-info">Supporting text for top level list item</div>
							</d2l-list-item-content>
							${nested ? html`
								<d2l-list slot="nested" add-button>
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
										<d2l-list slot="nested" add-button>
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
											<d2l-list slot="nested" add-button>
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
					</d2l-list>
				`;
			}

			[
				{ name: 'hover first add button', template: createExpandableListWithAddButton(), action: async(elem) => {
					await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
					await oneEvent(elem, 'd2l-tooltip-show');
				} },
				{ name: 'hover second add button, not expanded', template: createExpandableListWithAddButton(), action: async(elem) => {
					await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelectorAll('d2l-button-add')[1]);
					await oneEvent(elem, 'd2l-tooltip-show');
				} },
				{ name: 'hover second add button, expanded', template: createExpandableListWithAddButton({ expanded: true }), action: async(elem) => {
					await hoverElem(elem.querySelectorAll('d2l-list-item')[1].shadowRoot.querySelector('d2l-button-add'));
					await oneEvent(elem, 'd2l-tooltip-show');
				} },
				{ name: 'hover add button at bottom of nested list', template: createExpandableListWithAddButton({ expanded: true, nestedMultiple: true }), action: async(elem) => {
					await hoverElem(elem.querySelector('d2l-list-item[key="L3-2b"]').shadowRoot.querySelector('d2l-button-add'));
					await oneEvent(elem, 'd2l-tooltip-show');
				} },
			].forEach(({ name, template, action }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});

		describe('add-button + nested', () => {
			function createNestedListWithAddButton(opts) {
				const { color1, color3, selected, indentation } = { selected: [false, false, false], indentation: false, ...opts };
				return html`
					<d2l-list style="width: 600px;" add-button>
						<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
						<d2l-list-item selectable label="L1-1" key="L1-1" indentation="${ifDefined(indentation ? '35' : undefined)}">
							<d2l-list-item-content>
								<div>Level 1, Item 1</div>
								<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
							</d2l-list-item-content>
							<div slot="actions">
								<button>action 1</button>
								<button>action 2</button>
							</div>
							<d2l-list slot="nested" separators="between" add-button>
								<d2l-list-item selectable ?selected="${selected[0]}" color="${ifDefined(color1)}" label="L2-1" key="L2-1">
									<d2l-list-item-content>
										<div>Level 2, Item 1</div>
										<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item selectable label="L2-2" key="L2-2" indentation="${ifDefined(indentation ? '40' : undefined)}">
									<d2l-list-item-content>
										<div>Level 2, Item 2</div>
										<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
									</d2l-list-item-content>
									<d2l-list slot="nested" separators="between" add-button>
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
				{ name: 'default', template: createNestedListWithAddButton() },
				{ name: 'some-selected', template: createNestedListWithAddButton({ selected: [false, false, true] }) },
				{ name: 'all-selected', template: createNestedListWithAddButton({ selected: [true, true, true] }) },
			].forEach(({ name, template }) => {
				it(name, async() => {
					const elem = await fixture(template);
					await expect(elem).to.be.golden({ margin: 24 });
				});
			});

			[
				{ name: 'only on root list', template: html`
					<d2l-list style="width: 600px;" add-button>
						<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
						<d2l-list-item selectable label="L1-1" key="L1-1">
							<d2l-list-item-content>
								<div>Level 1, Item 1</div>
								<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
							</d2l-list-item-content>
							<d2l-list slot="nested">
								<d2l-list-item selectable label="L2-1" key="L2-1">
									<d2l-list-item-content>
										<div>Level 2, Item 1</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item selectable label="L2-2" key="L2-2">
									<d2l-list-item-content>
										<div>Level 2, Item 2</div>
									</d2l-list-item-content>
								</d2l-list-item>
							</d2l-list>
						</d2l-list-item>
					</d2l-list>
				` },
				{ name: 'only on nested list', template: html`
					<d2l-list style="width: 600px;">
						<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
						<d2l-list-item selectable label="L1-1" key="L1-1">
							<d2l-list-item-content>
								<div>Level 1, Item 1</div>
								<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
							</d2l-list-item-content>
							<d2l-list slot="nested" add-button>
								<d2l-list-item selectable label="L2-1" key="L2-1">
									<d2l-list-item-content>
										<div>Level 2, Item 1</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item selectable label="L2-2" key="L2-2">
									<d2l-list-item-content>
										<div>Level 2, Item 2</div>
									</d2l-list-item-content>
								</d2l-list-item>
							</d2l-list>
						</d2l-list-item>
					</d2l-list>
				` }
			].forEach(({ name, template }) => {
				it(`add button ${name}`, async() => {
					const elem = await fixture(template);
					await expect(elem).to.be.golden({ margin: 24 });
				});
			});
		});

	});
});
