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
		supportingText: ''
	},
	'L1-3': {
		primaryText: 'Computer Science (L3)',
		supportingText: ''
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
		supportingText: 'Supporting Info'
	},
	'L3-2': {
		primaryText: 'Weathering (L3)',
		supportingText: 'Supporting Info'
	},
	'L3-3': {
		primaryText: 'Volcanism (L3)',
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
				<d2l-list separators="all">
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
