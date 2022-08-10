import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-overflow-group.js';
import { fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-filter-overflow-group', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-filter-overflow-group');
		});
	});

	describe('dynamically add/remove filters', () => {

		it('append', async() => {
			const container = await fixture(html`<d2l-filter-overflow-group>
					<d2l-filter>
						<d2l-filter-dimension-set key="skill1" text="Skill1">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-filter>
						<d2l-filter-dimension-set key="skill2" text="Skill2">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</d2l-filter-overflow-group>
			`);
			const newFilter = document.createElement('d2l-filter');
			container.appendChild(newFilter);
			await oneEvent(container, 'd2l-overflow-group-updated');
		});

		it('remove', async() => {
			const container = await fixture(html`<d2l-filter-overflow-group>
					<d2l-filter>
						<d2l-filter-dimension-set key="skill1" text="Skill1">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-filter id="last">
						<d2l-filter-dimension-set key="skill2" text="Skill2">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</d2l-filter-overflow-group>
			`);
			const lastFilter = container.querySelector('#last');
			container.removeChild(lastFilter);
			await oneEvent(container, 'd2l-overflow-group-updated');
		});

	});

});
