import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { moveLocations } from '../list-item-drag-drop-mixin.js';
import { repeat } from 'lit-html/directives/repeat.js';

class ListDemoDragAndDrop extends LitElement {

	static get properties() {
		return {
			items: { type: Array }
		};
	}

	constructor() {
		super();
		this.items = [{
			key: '1',
			primaryText: 'Introductory Earth Sciences',
			supportingText: 'This course explores the geological processes of the Earth\'s interior and surface. These include volcanism, earthquakes, mountain building, glaciation and weathering.',
			imgSrc: 'https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg',
			dropNested: true,
			items: [{
				key: '1-1',
				primaryText: 'Glaciation',
				supportingText: 'Nesting Allowed',
				imgSrc: 'https://s.brightspace.com/course-images/images/bf648978-6637-4fdc-815b-81572c436c0e/tile-high-density-max-size.jpg',
				dropNested: true,
				items: []
			}, {
				key: '1-2',
				primaryText: 'Weathering',
				supportingText: 'Nesting Allowed',
				imgSrc: 'https://s.brightspace.com/course-images/images/50f91ba6-7c25-482a-bd71-1c4b7c8d2154/tile-high-density-min-size.jpg',
				dropNested: true,
				items: []
			}, {
				key: '1-3',
				primaryText: 'Volcanism',
				supportingText: 'Nesting Allowed',
				imgSrc: 'https://s.brightspace.com/course-images/images/5eb2371d-6099-4c8d-8aad-075f357012a2/tile-high-density-min-size.jpg',
				dropNested: true,
				items: []
			}]
		}, {
			key: '2',
			primaryText: 'Flow and Transport Through Fractured Rocks',
			supportingText: 'Fractures are ubiquitous in geologic media and important in disciplines such as physical and contaminant hydrogeology, geotechnical engineering, civil and environmental engineering, petroleum engineering among other areas.',
			imgSrc: 'https://s.brightspace.com/course-images/images/e5fd575a-bc14-4a80-89e1-46f349a76178/tile-high-density-max-size.jpg',
			items: [{
				key: '2-1',
				primaryText: 'Contaminant Transport',
				supportingText: 'No Nesting Allowed',
				imgSrc: 'https://s.brightspace.com/course-images/images/824fffa1-86a6-4489-84ba-91edfbc1dcc4/tile-high-density-min-size.jpg',
				dropNested: false,
				items: []
			}, {
				key: '2-2',
				primaryText: 'Modelling Flow in Fractured Media',
				supportingText: 'No Nesting Allowed',
				imgSrc: 'https://s.brightspace.com/course-images/images/e18c92a4-b996-444f-84b5-988874feccac/tile-high-density-min-size.jpg',
				dropNested: false,
				items: []
			}]
		}, {
			key: '3',
			primaryText: 'Applied Wetland Science',
			supportingText: 'Advanced concepts on wetland ecosystems in the context of regional and global earth systems processes such as carbon and nitrogen cycling and climate change, applications of wetland paleoecology, use of isotopes and other geochemical tools in wetland science, and wetland engineering in landscape rehabilitation and ecotechnology.',
			imgSrc: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg',
			items: [{
				key: '3-1',
				primaryText: 'Carbon & Nitrogen Cycling',
				supportingText: 'Nesting Allowed',
				imgSrc: 'https://s.brightspace.com/course-images/images/623b420b-a305-4762-8af8-598f0e72e956/tile-high-density-min-size.jpg',
				dropNested: true,
				items: []
			}, {
				key: '3-2',
				primaryText: 'Wetland Engineering',
				supportingText: 'Nesting Allowed',
				imgSrc: 'https://s.brightspace.com/course-images/images/26102577-8f2a-4e24-84b5-19d76decbc7a/tile-high-density-min-size.jpg',
				dropNested: true,
				items: []
			}]
		}];
	}

	render() {
		const renderList = (items, nested) => {
			return html`
				<d2l-list grid drag-multiple slot="${ifDefined(nested ? 'nested' : undefined)}">
					${repeat(items, item => item.key, item => html`
						<d2l-list-item
							action-href="http://www.d2l.com"
							draggable
							drag-handle-text="${item.primaryText}"
							?drop-nested="${item.dropNested}"
							key="${item.key}"
							label="${item.primaryText}"
							selectable>
								${item.imgSrc.length === 0 ? null : html`<img slot="illustration" src="${item.imgSrc}">`}
								<d2l-list-item-content>
									<div>${item.primaryText}</div>
									<div slot="supporting-info">${item.supportingText}</div>
								</d2l-list-item-content>
								${item.items.length > 0 ? renderList(item.items, true) : null}
						</d2l-list-item>
					`)}
				</d2l-list>
			`;
		};

		return html`
			<div @d2l-list-items-move="${this._handleListItemsMove}">
				${renderList(this.items, false)}
			</div>
		`;
	}

	async _handleListItemsMove(e) {

		const sourceListItems = e.detail.sourceItems;
		const target = e.detail.target;

		// helper that gets the array containing item data, the item data, and the index within the array
		const getItemInfo = (items, key) => {
			for (let i = 0; i < items.length; i++) {
				if (items[i].key === key) {
					return { owner: items, item: items[i], index: i };
				}
				if (items[i].items && items[i].items.length > 0) {
					const tempItemData = getItemInfo(items[i].items, key);
					if (tempItemData) return tempItemData;
				}
			}
		};

		const dataToMove = [];

		// remove data elements from original locations
		sourceListItems.forEach(sourceListItem => {
			const info = getItemInfo(this.items, sourceListItem.key);
			info.owner.splice(info.index, 1);
			dataToMove.push(info.item);
		});

		// append data elements to new location
		const targetInfo = getItemInfo(this.items, target.item.key);
		let targetItems;
		let targetIndex;
		if (target.location === moveLocations.nest) {
			if (!targetInfo.item.items) targetInfo.item.items = [];
			targetItems = targetInfo.item.items;
			targetIndex = targetItems.length;
		} else {
			targetItems = targetInfo.owner;
			if (target.location === moveLocations.above) targetIndex = targetInfo.index;
			else if (target.location === moveLocations.below) targetIndex = targetInfo.index + 1;
		}
		for (let i = dataToMove.length - 1; i >= 0; i--) {
			targetItems.splice(targetIndex, 0, dataToMove[i]);
		}

		this.requestUpdate();
		await this.updateComplete;

		if (e.detail.keyboardActive) {
			requestAnimationFrame(() => {
				if (!this.shadowRoot) return;
				const newItem = this.shadowRoot.querySelector('d2l-list').getListItemByKey(sourceListItems[0].key);
				newItem.activateDragHandle();
			});
		}

	}

}

customElements.define('d2l-demo-list-drag-and-drop', ListDemoDragAndDrop);
