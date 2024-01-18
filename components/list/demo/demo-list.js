/* eslint-disable indent */
import '../../button/button-icon.js';
import '../../dropdown/dropdown-button-subtle.js';
import '../../dropdown/dropdown-menu.js';
import '../../dropdown/dropdown-more.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../paging/pager-load-more.js';
import '../../selection/selection-action.js';
import '../../selection/selection-action-dropdown.js';
import '../../selection/selection-action-menu-item.js';
import '../../tooltip/tooltip.js';
import '../list-controls.js';
import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { css, html, LitElement } from 'lit';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

const items = [{
	key: '1',
	primaryText: 'Introductory Earth Sciences',
	supportingText: 'This course explores the geological process of the Earth\'s interior and surface. These include volcanism, earthquakes, mountains...',
	imgSrc: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg',
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
	primaryText: 'Engineering Materials for Energy Systems',
	supportingText: 'Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.',
	imgSrc: 'https://s.brightspace.com/course-images/images/c87d778f-e5f1-442b-8ac7-5d1a3d7ca725/tile-high-density-max-size.jpg',
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
	primaryText: 'Geomorphology and GIS',
	supportingText: 'Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow\'s nest rutters.',
	imgSrc: 'https://s.brightspace.com/course-images/images/2f035317-5014-4095-82c8-e29f34c7f99e/tile-high-density-max-size.jpg',
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
}, {
	key: '4',
	primaryText: 'Pedagogy Case Studies',
	supportingText: 'Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to. Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors.',
	imgSrc: 'https://s.brightspace.com/course-images/images/e5fd575a-bc14-4a80-89e1-46f349a76178/tile-high-density-max-size.jpg',
	items: []
}, {
	key: '5',
	primaryText: 'Introduction to Painting',
	supportingText: 'Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits. Bring a spring upon her cable holystone blow the man down spanker.',
	imgSrc: 'https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-high-density-max-size.jpg',
	items: []
}, {
	key: '6',
	primaryText: 'Analytical Chemistry',
	supportingText: 'Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.',
	imgSrc: 'https://s.brightspace.com/course-images/images/85f865dd-4c73-49c5-8809-c872256f7715/tile-high-density-max-size.jpg',
	items: []
}, {
	key: '7',
	primaryText: 'Plant Biology',
	supportingText: 'Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker.',
	imgSrc: 'https://s.brightspace.com/course-images/images/61f07ae4-4686-4019-8146-1604cb8ae9bf/tile-high-density-max-size.jpg',
	items: []
}];

class DemoList extends LitElement {

	static get properties() {
		return {
			addButton: { type: Boolean, attribute: 'add-button' },
			grid: { type: Boolean },
			extendSeparators: { type: Boolean, attribute: 'extend-separators' },
			_lastItemLoadedIndex: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			img {
				height: 500px;
				object-fit: cover;
			}
		`;
	}

	constructor() {
		super();
		this.extendSeparators = false;
		this.items = JSON.parse(JSON.stringify(items));
		this._lastItemLoadedIndex = 2;
		this._pageSize = 2;
	}

	render() {
		const loadedItems = this.items.slice(0, this._lastItemLoadedIndex + 1);
		const remainingItemCount = this.items.length - loadedItems.length;
		const addButtonText = this.addButton ? 'Add New Item' : undefined;
		return html`
			<d2l-list
				?grid="${this.grid}"
				item-count="${this.items.length}"
				?extend-separators="${this.extendSeparators}"
				?add-button="${this.addButton}"
				add-button-text="${ifDefined(addButtonText)}">
				<d2l-list-controls slot="controls" select-all-pages-allowed>
					<d2l-selection-action icon="tier1:plus-default" text="Add" @d2l-selection-action-click="${this._handleAddItem}"></d2l-selection-action>
					<d2l-selection-action-dropdown text="Move To" requires-selection>
						<d2l-dropdown-menu>
							<d2l-menu label="Move To Options">
								<d2l-menu-item text="Top of Quiz"></d2l-menu-item>
								<d2l-menu-item text="Bottom of Quiz"></d2l-menu-item>
								<d2l-menu-item text="Section">
									<d2l-menu>
										<d2l-menu-item text="Option 1"></d2l-menu-item>
										<d2l-menu-item text="Option 2"></d2l-menu-item>
									</d2l-menu>
								</d2l-menu-item>
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-selection-action-dropdown>
					<d2l-dropdown-button-subtle text="Actions">
						<d2l-dropdown-menu>
							<d2l-menu label="Actions">
								<d2l-selection-action-menu-item text="Bookmark (requires selection)" requires-selection></d2l-selection-action-menu-item>
								<d2l-selection-action-menu-item text="Advanced"></d2l-selection-action-menu-item>
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-dropdown-button-subtle>
					<d2l-selection-action icon="tier1:gear" text="Settings" requires-selection></d2l-selection-action>
				</d2l-list-controls>
				${repeat(loadedItems, item => item.key, item => {
					const tooltipButtonId = getUniqueId();
					return html`
						<d2l-list-item href="http://www.d2l.com" key="${item.key}" label="${item.primaryText}" selectable>
							<img slot="illustration" src="${item.imgSrc}">
							<d2l-list-item-content>
								<div>${item.primaryText}</div>
								<div slot="supporting-info">${item.supportingText}</div>
							</d2l-list-item-content>
							<div slot="actions">
								<d2l-button-icon id="${tooltipButtonId}" text="My Button" icon="tier1:preview"></d2l-button-icon>
								<d2l-tooltip for="${tooltipButtonId}">Preview</d2l-tooltip>
								<d2l-dropdown-more text="Open!">
									<d2l-dropdown-menu>
										<d2l-menu label="Astronomy">
											<d2l-menu-item text="Introduction"></d2l-menu-item>
											<d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
										</d2l-menu>
									</d2l-dropdown-menu>
								</d2l-dropdown-more>
							</div>
						</d2l-list-item>
					`;
				})}
				<d2l-pager-load-more slot="pager"
					@d2l-pager-load-more="${this._handlePagerLoadMore}"
					?has-more="${this._lastItemLoadedIndex < this.items.length - 1}"
					page-size="${remainingItemCount < this._pageSize ? remainingItemCount : this._pageSize}">
				</d2l-pager-load-more>
			</d2l-list>
		`;
	}

	_handleAddItem() {
		const newKey = getUniqueId();
		this.items.push({
			key: newKey,
			primaryText: `New Item ${newKey}`,
			supportingText: 'Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.',
			imgSrc: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg',
			items: []
		});
		this.requestUpdate();
	}

	_handlePagerLoadMore(e) {
		// mock delay consumers might have
		setTimeout(() => {
			this._lastItemLoadedIndex += this._pageSize;
			e.detail.complete();
		}, 2000);

	}

}
customElements.define('d2l-demo-list', DemoList);
