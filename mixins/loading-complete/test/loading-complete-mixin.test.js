import { defineCE, fixture } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { LoadingCompleteMixin } from '../loading-complete-mixin.js';

const DummyMixin = superclass => class extends superclass {

	async getLoadingComplete() {
		await super.getLoadingComplete?.();
		this.resolveLoadingComplete();
	}

};

const mixinSubclassTag = defineCE(
	class extends LoadingCompleteMixin(DummyMixin(LitElement)) {}
);

const mixinSuperclassTag = defineCE(
	class extends DummyMixin(LoadingCompleteMixin(LitElement)) {}
);

const componentLevelOverrideTag = defineCE(
	class extends LoadingCompleteMixin(LitElement) {

		async getLoadingComplete() {
			await super.getLoadingComplete();
		}

	}
);

describe('LoadingCompleteMixin', () => {

	it('inherits existing getLoadingComplete', async() => {
		await fixture(`
			<${mixinSubclassTag}></${mixinSubclassTag}>
		`);
	});

	it('overrides existing getLoadingComplete', async() => {
		await fixture(`
			<${mixinSuperclassTag}></${mixinSuperclassTag}>
		`);
	});

	it('resolves LoadingComplete implicitly for component-level override', async() => {
		await fixture(`
			<${componentLevelOverrideTag}></${componentLevelOverrideTag}>
		`);
	});

});
