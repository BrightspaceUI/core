import '../../button/button-icon.js';
import '../../demo/demo-page.js';
import '../../dropdown/dropdown-menu.js';
import '../../dropdown/dropdown-more.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../tooltip/tooltip.js';
import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import '../../tag-list/tag-list.js';
import '../../tag-list/tag-list-item.js';
import '../../selection/selection-action.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const normalFixture = html`
	<d2l-list>
		<d2l-list-controls slot="controls">
			<d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
			<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
		</d2l-list-controls>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
		</d2l-list-item>
		<d2l-list-item href="http://www.d2l.com">
			<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
		</d2l-list-item>
		<d2l-list-item-button>
			<div class="d2l-list-item-text d2l-body-compact">Apply a decision-making process to assess risks and make safe decisions in a variety of situations</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.1</div>
		</d2l-list-item-button>
	</d2l-list>
`;

const gridFixture = html`
<d2l-list grid>
  <d2l-list-controls slot="controls">
    <d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
    <d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
  </d2l-list-controls>
  <d2l-list-item selectable key="L1-1" label="Label for L1-1">
    <d2l-list-item-content>
      <div>Earth Sciences (L1)</div>
      <div slot="supporting-info">Earth science or geoscience includes all fields of natural science related to planet Earth. This is a branch of science dealing with the physical and chemical constitution of Earth and its atmosphere. Earth science can be considered to be a branch of planetary science, but with a much older history.</div>
    </d2l-list-item-content>
    <d2l-list add-button slot="nested" grid separators="all">
      <d2l-list-item selectable key="L2-1" label="Label for L2-1">
        <d2l-list-item-content>
          <div>Introductory Earth Sciences (L2)</div>
          <div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain building, glaciation and weathering. Students will gain an appreciation of how these processes have controlled the evolution of our planet and the role of geology in meeting society's current and future demand for sustainable energy and mineral resources.</div>
        </d2l-list-item-content>
        <d2l-list slot="nested" grid separators="all">
          <d2l-list-item selectable key="L3-1" label="Label for L3-1">
            <d2l-list-item-content>
              <div>Glaciation (L3)</div>
              <div slot="supporting-info">Supporting Info</div>
            </d2l-list-item-content>
            <d2l-list slot="nested" grid separators="all">
              <d2l-list-item selectable key="L4-1" label="Label for L4-1">
                <d2l-list-item-content>
                  <div>Ice Sheets (L4)</div>
                  <div slot="supporting-info">Supporting Info</div>
                </d2l-list-item-content>
              </d2l-list-item>
              <d2l-list-item selectable key="L4-2" label="Label for L4-2">
                <d2l-list-item-content>
                  <div>Alpine Glaciers (L4)</div>
                  <div slot="supporting-info">Supporting Info</div>
                </d2l-list-item-content>
              </d2l-list-item>
            </d2l-list>
          </d2l-list-item>
          <d2l-list-item selectable key="L3-2" label="Label for L3-2">
            <d2l-list-item-content>
              <div>Weathering (L3)</div>
              <div slot="supporting-info">Supporting Info</div>
            </d2l-list-item-content>
          </d2l-list-item>
          <d2l-list-item selectable key="L3-3" label="Label for L3-3">
            <d2l-list-item-content>
              <div>Volcanism (L3)</div>
              <div slot="supporting-info">Supporting Info</div>
            </d2l-list-item-content>
          </d2l-list-item>
        </d2l-list>
      </d2l-list-item>
      <d2l-list-item selectable key="L2-2" label="Label for L2-2">
        <d2l-list-item-content>
          <div>Flow and Transport Through Fractured Rocks (L2)</div>
          <div slot="supporting-info">Fractures are ubiquitous in geologic media and important in disciplines such as physical and contaminant hydrogeology, geotechnical engineering, civil and environmental engineering, petroleum engineering among other areas. Despite the importance of fractures, its characterization and predictions of groundwater flow and contaminant transport are fraught with significant difficulties. Students are taught to deal with fractures in hydrogeology, to conceptualize them, and to build reliable models for predicting groundwater flow and contaminant transport.</div>
        </d2l-list-item-content>
      </d2l-list-item>
      <d2l-list-item selectable key="L2-3" label="Label for L2-3">
        <d2l-list-item-content>
          <div>Applied Wetland Science (L2)</div>
          <div slot="supporting-info">Advanced concepts on wetland ecosystems in the context of regional and global earth systems processes such as carbon and nitrogen cycling and climate change, applications of wetland paleoecology, use of isotopes and other geochemical tools in wetland science, and wetland engineering in landscape rehabilitation and ecotechnology. Current issues in Canada and abroad will be examined.</div>
        </d2l-list-item-content>
      </d2l-list-item>
    </d2l-list>
    <div slot="actions">
      <d2l-button-icon text="My Button" icon="tier1:preview"></d2l-button-icon>
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
  <d2l-list-item selectable key="L1-2" label="Label for L1-2">
    <div>Biology (L1)</div>
  </d2l-list-item>
  <d2l-list-item selectable key="L1-3" label="Label for L1-3">
    <div>Computer Science (L1)</div>
  </d2l-list-item>
  <d2l-pager-load-more slot="pager" has-more page-size="5">
  </d2l-pager-load-more>
</d2l-list>
`;

describe('d2l-list', () => {

	it('should pass all aXe tests', async() => {
		const elem = await fixture(normalFixture);
		await expect(elem).to.be.accessible();
	});

	it('should pass all aXe tests grid', async() => {
		const elem = await fixture(gridFixture);
		await expect(elem).to.be.accessible();
	});

});
