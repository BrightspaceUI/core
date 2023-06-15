import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-overflow-group.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-filter-overflow-group', () => {

	it('default', async() => {
		const normal = await fixture(html`<d2l-filter-overflow-group>
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
		await expect(normal).to.be.accessible();
	});
	it('overflowing', async() => {
		const overflow = await fixture(html`<d2l-filter-overflow-group max-to-show="2">
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
				<d2l-filter>
					<d2l-filter-dimension-set key="skill3" text="Skill3">
						<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
			</d2l-filter-overflow-group>
		`);
		await expect(overflow).to.be.accessible();
	});
});

