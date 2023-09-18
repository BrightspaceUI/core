import '../demo/skeleton-group-test-wrapper.js';
import '../demo/skeleton-test-box.js';
import '../demo/skeleton-test-container.js';
import '../demo/skeleton-test-heading.js';
import { expect, fixture, html, waitUntil } from '@brightspace-ui/testing';

const oneSkeletonFixture = html`
	<d2l-skeleton-group-test-wrapper style="width: 330px">
		<d2l-test-skeleton-container skeleton></d2l-test-skeleton-container>
		<d2l-test-skeleton-container></d2l-test-skeleton-container>
		<d2l-test-skeleton-container></d2l-test-skeleton-container>
	</d2l-skeleton-group-test-wrapper>
`;

const noSkeletonFixture = html`
	<d2l-skeleton-group-test-wrapper style="width: 330px">
		<d2l-test-skeleton-container></d2l-test-skeleton-container>
		<d2l-test-skeleton-container></d2l-test-skeleton-container>
		<d2l-test-skeleton-container></d2l-test-skeleton-container>
	</d2l-skeleton-group-test-wrapper>
`;

const nestedGroupsRemoveAllFixture = html`
	<div style="width: 330px">
		<d2l-skeleton-group-test-wrapper id="to-remove" skeleton>
			<d2l-skeleton-group-test-wrapper id="to-remove" skeleton>
				<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
				<d2l-test-skeleton-box id="to-remove" skeleton></d2l-test-skeleton-box>
				<d2l-test-skeleton-container></d2l-test-skeleton-container>
			</d2l-skeleton-group-test-wrapper>
			<d2l-skeleton-group-test-wrapper>
				<d2l-test-skeleton-box></d2l-test-skeleton-box>
			</d2l-skeleton-group-test-wrapper>
		</d2l-skeleton-group-test-wrapper>
	</div>
`;

describe('d2l-skeleton-group', () => {

	it('all-skeleton', async() => {
		const elem = await fixture(html`
			<d2l-skeleton-group-test-wrapper style="width: 330px">
				<d2l-test-skeleton-container skeleton></d2l-test-skeleton-container>
				<d2l-test-skeleton-container skeleton></d2l-test-skeleton-container>
				<d2l-test-skeleton-container skeleton></d2l-test-skeleton-container>
			</d2l-skeleton-group-test-wrapper>
		`);
		await expect(elem).to.be.golden();
	});

	it('one-skeleton', async() => {
		const elem = await fixture(oneSkeletonFixture);
		await expect(elem).to.be.golden();
	});

	it('no-skeleton', async() => {
		const elem = await fixture(noSkeletonFixture);
		await expect(elem).to.be.golden();
	});

	it('make-one-skeleton', async() => {
		const elem = await fixture(noSkeletonFixture);
		const container = elem.querySelector('d2l-test-skeleton-container');
		container.skeleton = true;
		await container.updateComplete;
		await expect(elem).to.be.golden();
	});

	it('make-one-not-skeleton', async() => {
		const elem = await fixture(oneSkeletonFixture);
		const container = elem.querySelector('d2l-test-skeleton-container');
		container.skeleton = false;
		await container.updateComplete;
		await expect(elem).to.be.golden();
	});

	it('add-element', async() => {
		const elem = await fixture(noSkeletonFixture);
		elem.insertAdjacentHTML('beforeend', '<d2l-test-skeleton-container skeleton></d2l-test-skeleton-container>');
		await waitUntil(() => elem.skeleton);
		await elem.updateComplete;
		await expect(elem).to.be.golden();
	});

	it('remove-element', async() => {
		const elem = await fixture(oneSkeletonFixture);
		elem.querySelector('d2l-test-skeleton-container[skeleton]').remove();
		await waitUntil(() => !elem.skeleton);
		await elem.updateComplete;
		await expect(elem).to.be.golden();
	});

	[true, false].forEach((skeleton) => {
		it(`mixed-elements${skeleton ? '-skeleton' : ''}`, async() => {
			const elem = await fixture(html`
				<d2l-skeleton-group-test-wrapper style="width: 330px">
					<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
					<d2l-test-skeleton-container class="to-skeleton"></d2l-test-skeleton-container>
					<d2l-test-skeleton-box></d2l-test-skeleton-box>
				</d2l-skeleton-group-test-wrapper>
			`);
			elem.querySelector('.to-skeleton').skeleton = skeleton;
			await expect(elem).to.be.golden();
		});
	});

	[
		{
			name: 'nested-groups-inner',
			template: html`
				<d2l-skeleton-group-test-wrapper style="width: 330px">
					<d2l-skeleton-group-test-wrapper>
						<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
						<d2l-test-skeleton-box></d2l-test-skeleton-box>
						<d2l-test-skeleton-container class="skeleton-element"></d2l-test-skeleton-container>
					</d2l-skeleton-group-test-wrapper>
					<d2l-skeleton-group-test-wrapper>
						<d2l-test-skeleton-box></d2l-test-skeleton-box>
					</d2l-skeleton-group-test-wrapper>
				</d2l-skeleton-group-test-wrapper>
			`
		},
		{
			name: 'nested-groups-middle',
			template: html`
				<d2l-skeleton-group-test-wrapper style="width: 330px">
					<d2l-skeleton-group-test-wrapper class="skeleton-element">
						<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
						<d2l-test-skeleton-box></d2l-test-skeleton-box>
						<d2l-test-skeleton-container></d2l-test-skeleton-container>
					</d2l-skeleton-group-test-wrapper>
					<d2l-skeleton-group-test-wrapper>
						<d2l-test-skeleton-box></d2l-test-skeleton-box>
					</d2l-skeleton-group-test-wrapper>
				</d2l-skeleton-group-test-wrapper>
			`
		},
		{
			name: 'nested-groups-outer',
			template: html`
				<div style="width: 330px">
					<d2l-skeleton-group-test-wrapper class="skeleton-element">
						<d2l-skeleton-group-test-wrapper>
							<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
							<d2l-test-skeleton-box></d2l-test-skeleton-box>
							<d2l-test-skeleton-container></d2l-test-skeleton-container>
						</d2l-skeleton-group-test-wrapper>
						<d2l-skeleton-group-test-wrapper>
							<d2l-test-skeleton-box></d2l-test-skeleton-box>
						</d2l-skeleton-group-test-wrapper>
					</d2l-skeleton-group-test-wrapper>
				</div>
			`
		}
	].forEach(({ name, template }) => {
		[false, true].forEach((skeleton) => {
			it(`${name}${skeleton ? '-skeleton' : ''}`, async() => {
				const elem = await fixture(template);
				const elemToSkeleton = elem.querySelector('.skeleton-element');
				elemToSkeleton.skeleton = skeleton;
				await elemToSkeleton.updateComplete;
				await expect(elem).to.be.golden();
			});
		});
	});

	[
		{
			name: 'nested-groups-remove-inner',
			template: html`
				<d2l-skeleton-group-test-wrapper skeleton style="width: 330px">
					<d2l-skeleton-group-test-wrapper skeleton>
						<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
						<d2l-test-skeleton-box id="to-remove" skeleton></d2l-test-skeleton-box>
						<d2l-test-skeleton-container></d2l-test-skeleton-container>
					</d2l-skeleton-group-test-wrapper>
					<d2l-skeleton-group-test-wrapper>
						<d2l-test-skeleton-box></d2l-test-skeleton-box>
					</d2l-skeleton-group-test-wrapper>
				</d2l-skeleton-group-test-wrapper>
			`
		},
		{
			name: 'nested-groups-remove-middle',
			template: html`
				<d2l-skeleton-group-test-wrapper skeleton style="width: 330px">
					<d2l-skeleton-group-test-wrapper id="to-remove" skeleton>
						<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
						<d2l-test-skeleton-box skeleton></d2l-test-skeleton-box>
						<d2l-test-skeleton-container></d2l-test-skeleton-container>
					</d2l-skeleton-group-test-wrapper>
					<d2l-skeleton-group-test-wrapper>
						<d2l-test-skeleton-box></d2l-test-skeleton-box>
					</d2l-skeleton-group-test-wrapper>
				</d2l-skeleton-group-test-wrapper>
			`
		},
		{
			name: 'nested-groups-remove-outer',
			template: html`
				<div style="width: 330px">
					<d2l-skeleton-group-test-wrapper id="to-remove" skeleton>
						<d2l-skeleton-group-test-wrapper skeleton>
							<d2l-test-skeleton-heading level="1">Heading 1</d2l-test-skeleton-heading>
							<d2l-test-skeleton-box skeleton></d2l-test-skeleton-box>
							<d2l-test-skeleton-container></d2l-test-skeleton-container>
						</d2l-skeleton-group-test-wrapper>
						<d2l-skeleton-group-test-wrapper>
							<d2l-test-skeleton-box></d2l-test-skeleton-box>
						</d2l-skeleton-group-test-wrapper>
					</d2l-skeleton-group-test-wrapper>
				</div>
			`
		}
	].forEach(({ name, template }) => {
		it(`${name}`, async() => {
			const elem = await fixture(template);
			const elemToRemove = elem.querySelector('#to-remove');
			elemToRemove.skeleton = false;
			await elemToRemove.updateComplete;
			await expect(elem).to.be.golden();
		});
	});

	it('nested-groups-remove-all-before', async() => {
		const elem = await fixture(nestedGroupsRemoveAllFixture);
		await expect(elem).to.be.golden();
	});

	it('nested-groups-remove-all-after', async() => {
		const elem = await fixture(nestedGroupsRemoveAllFixture);
		const elements = elem.querySelectorAll('#to-remove');
		elements.forEach(el => el.skeleton = false);
		await expect(elem).to.be.golden();
	});

});
