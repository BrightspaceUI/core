import '../list.js';
import '../list-item.js';
import '../list-item-content.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`
	<d2l-list>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
		</d2l-list-item>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Apply a decision-making process to assess risks and make safe decisions in a variety of situations</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.1</div>
		</d2l-list-item>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Retain objects of various shapes and sizes in different ways, while moving around others and equipment</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.2</div>
		</d2l-list-item>
	</d2l-list>
`;

describe('d2l-list', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const elem = await fixture(normalFixture);
			await expect(elem).to.be.accessible;
		});

	});

	describe('constructor', () => {

		it('should construct list', () => {
			runConstructor('d2l-list');
		});

		it('should construct list-item', () => {
			runConstructor('d2l-list-item');
		});

		it('should construct list-item-content', () => {
			runConstructor('d2l-list-item-content');
		});

	});

});
