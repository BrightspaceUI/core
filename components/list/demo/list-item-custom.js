import '../list.js';
import '../list-item-content.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemMixin } from '../list-item-mixin.js';

const demoData = {
	'L1-1': {
		primaryText: 'Earth Sciences (L1)',
		supportingText: 'Earth science or geoscience includes all fields of natural science related to planet Earth. This is a branch of science dealing with the physical and chemical constitution of Earth and its atmosphere. Earth science can be considered to be a branch of planetary science, but with a much older history.',
		nested: [ 'L2-1', 'L2-2', 'L2-3' ]
	},
	'L1-2': {
		primaryText: 'Biology (L1)',
		supportingText: 'Supporting Info'
	},
	'L1-3': {
		primaryText: 'Computer Science (L3)',
		supportingText: 'Supporting Info'
	},
	'L2-1': {
		primaryText: 'Introductory Earth Sciences (L2)',
		supportingText: 'This course explores the geological processes of the Earth\'s interior and surface. These include volcanism, earthquakes, mountain building, glaciation and weathering. Students will gain an appreciation of how these processes have controlled the evolution of our planet and the role of geology in meeting society\'s current and future demand for sustainable energy and mineral resources.',
		nested: [ 'L3-1', 'L3-2', 'L3-3' ]
	},
	'L2-2': {
		primaryText: 'Flow and Transport Through Fractured Rocks (L2)',
		supportingText: 'Fractures are ubiquitous in geologic media and important in disciplines such as physical and contaminant hydrogeology, geotechnical engineering, civil and environmental engineering, petroleum engineering among other areas. Despite the importance of fractures, its characterization and predictions of groundwater flow and contaminant transport are fraught with significant difficulties. Students are taught to deal with fractures in hydrogeology, to conceptualize them, and to build reliable models for predicting groundwater flow and contaminant transport.'
	},
	'L2-3': {
		primaryText: 'Applied Wetland Science (L2)',
		supportingText: 'Advanced concepts on wetland ecosystems in the context of regional and global earth systems processes such as carbon and nitrogen cycling and climate change, applications of wetland paleoecology, use of isotopes and other geochemical tools in wetland science, and wetland engineering in landscape rehabilitation and ecotechnology. Current issues in Canada and abroad will be examined.'
	},
	'L3-1': {
		primaryText: 'Glaciation (L3)',
		supportingText: 'Supporting Info',
		nested: [ 'L4-1', 'L4-2' ]
	},
	'L3-2': {
		primaryText: 'Weathering (L3)',
		supportingText: 'Supporting Info'
	},
	'L3-3': {
		primaryText: 'Volcanism (L3)',
		supportingText: 'Supporting Info'
	},
	'L4-1': {
		primaryText: 'Ice Sheets',
		supportingText: 'Supporting Info',
		nested: [ /*'L5-1', 'L5-2', 'L5-3', 'L5-4', 'L5-5'*/ ]
	},
	'L4-2': {
		primaryText: 'Alpine Glaciers',
		supportingText: 'Supporting Info'
	},
	'L5-1': {
		primaryText: 'Topic L5-1',
		supportingText: 'Supporting Info',
		nested: [ 'L6-1' /*, 'L6-2', 'L6-3', 'L6-4', 'L6-5', 'L6-6', 'L6-7', 'L6-8'*/ ]
	},
	'L5-2': {
		primaryText: 'Topic L5-2',
		supportingText: 'Supporting Info',
		nested: [ 'L6-1', 'L6-2', 'L6-3', 'L6-4', 'L6-5', 'L6-6', 'L6-7', 'L6-8' ]
	},
	'L5-3': {
		primaryText: 'Topic L5-3',
		supportingText: 'Supporting Info',
		nested: [ 'L6-1', 'L6-2', 'L6-3', 'L6-4', 'L6-5', 'L6-6', 'L6-7', 'L6-8' ]
	},
	'L5-4': {
		primaryText: 'Topic L5-4',
		supportingText: 'Supporting Info',
		nested: [ 'L6-1', 'L6-2', 'L6-3', 'L6-4', 'L6-5', 'L6-6', 'L6-7', 'L6-8' ]
	},
	'L5-5': {
		primaryText: 'Topic L5-5',
		supportingText: 'Supporting Info',
		nested: [ 'L6-1', 'L6-2', 'L6-3', 'L6-4', 'L6-5', 'L6-6', 'L6-7', 'L6-8' ]
	},
	'L6-1': {
		primaryText: 'Topic L6-1',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-2': {
		primaryText: 'Topic L6-2',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-3': {
		primaryText: 'Topic L6-3',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-4': {
		primaryText: 'Topic L6-4',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-5': {
		primaryText: 'Topic L6-5',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-6': {
		primaryText: 'Topic L6-6',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-7': {
		primaryText: 'Topic L6-7',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-8': {
		primaryText: 'Topic L6-8',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L6-9': {
		primaryText: 'Topic L6-9',
		supportingText: 'Supporting Info',
		nested: [ 'L7-1', 'L7-2', 'L7-3', 'L7-4', 'L7-5', 'L7-6', 'L7-7', 'L7-8', 'L7-9', 'L7-10' ]
	},
	'L7-1': {
		primaryText: 'Topic L7-1',
		supportingText: 'Supporting Info'
	},
	'L7-2': {
		primaryText: 'Topic L7-2',
		supportingText: 'Supporting Info'
	},
	'L7-3': {
		primaryText: 'Topic L7-3',
		supportingText: 'Supporting Info'
	},
	'L7-4': {
		primaryText: 'Topic L7-4',
		supportingText: 'Supporting Info'
	},
	'L7-5': {
		primaryText: 'Topic L7-5',
		supportingText: 'Supporting Info'
	},
	'L7-6': {
		primaryText: 'Topic L7-6',
		supportingText: 'Supporting Info'
	},
	'L7-7': {
		primaryText: 'Topic L7-7',
		supportingText: 'Supporting Info'
	},
	'L7-8': {
		primaryText: 'Topic L7-8',
		supportingText: 'Supporting Info'
	},
	'L7-9': {
		primaryText: 'Topic L7-9',
		supportingText: 'Supporting Info'
	},
	'L7-10': {
		primaryText: 'Topic L7-10',
		supportingText: 'Supporting Info'
	}
};

class DemoListItemCustom extends ListItemMixin(LitElement) {

	constructor() {
		super();
		this.selectable = true;
	}

	render() {
		const itemTemplates = {
			content: html`
				<d2l-list-item-content>
					<div>${demoData[this.key].primaryText}</div>
					<div slot="supporting-info">${demoData[this.key].supportingText}</div>
				</d2l-list-item-content>
			`
		};

		if (demoData[this.key].nested && demoData[this.key].nested.length > 0) {
			itemTemplates.nested = html`
				<d2l-list grid separators="all">
					${demoData[this.key].nested.map(itemKey => html`<d2l-demo-list-item-custom selectable key="${itemKey}"></d2l-demo-list-item-custom>`)}
				</d2l-list>
			`;
		}

		return this._renderListItem(itemTemplates);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('key')) {
			this.label = `Label for ${this.key}`;
		}
	}

}

customElements.define('d2l-demo-list-item-custom', DemoListItemCustom);
