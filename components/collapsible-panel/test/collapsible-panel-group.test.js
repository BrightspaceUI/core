import '../collapsible-panel.js';
import '../collapsible-panel-group.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-collapsible-panel-group', () => {

	it('should construct', () => {
		runConstructor('d2l-collapsible-panel-group');
	});

	it('should set bottom borders on inline panels', async() => {
		const elem = await fixture(html`
			<d2l-collapsible-panel-group>
				<d2l-collapsible-panel panel-title="Panel Title 1" type="inline"></d2l-collapsible-panel>
				<d2l-collapsible-panel panel-title="Panel Title 2" type="inline"></d2l-collapsible-panel>
				<d2l-collapsible-panel panel-title="Panel Title 3" type="inline"></d2l-collapsible-panel>
			</d2l-collapsible-panel-group>
		`);
		const panels = elem.querySelectorAll('d2l-collapsible-panel');
		expect(panels[0]._noBottomBorder).to.be.true;
		expect(panels[1]._noBottomBorder).to.be.true;
		expect(panels[2]._noBottomBorder).to.be.false;
	});

	it('should set bottom borders on delayed inline panels', async() => {
		const elem = await fixture(html`
			<d2l-collapsible-panel-group>
				<d2l-collapsible-panel panel-title="Panel Title 1"></d2l-collapsible-panel>
				<d2l-collapsible-panel panel-title="Panel Title 2"></d2l-collapsible-panel>
				<d2l-collapsible-panel panel-title="Panel Title 3"></d2l-collapsible-panel>
			</d2l-collapsible-panel-group>
		`);
		const panels = elem.querySelectorAll('d2l-collapsible-panel');
		panels[0].setAttribute('type', 'inline');
		await elem.updateComplete;
		expect(panels[0]._noBottomBorder).to.be.true;
		expect(panels[1]._noBottomBorder).to.be.true;
		expect(panels[2]._noBottomBorder).to.be.false;
	});

});
