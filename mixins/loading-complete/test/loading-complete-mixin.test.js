import { aTimeout, defineCE, fixture } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { LoadingCompleteMixin } from '../loading-complete-mixin.js';

const DummyMixin = superclass => class extends superclass {

	async getLoadingComplete() {
		await super.getLoadingComplete?.();
		return aTimeout();
	}

};

const mixinSubclassTag = defineCE(
	class extends LoadingCompleteMixin(DummyMixin(LitElement)) {

		connectedCallback() {
			super.connectedCallback();
			this.resolveLoadingComplete();
		}

	}
);

const mixinSuperclassTag = defineCE(
	class extends DummyMixin(LoadingCompleteMixin(LitElement)) {

		connectedCallback() {
			super.connectedCallback();
			this.resolveLoadingComplete();
		}

	}
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
