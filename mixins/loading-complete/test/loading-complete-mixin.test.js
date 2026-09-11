import { aTimeout, defineCE, expect, fixture, nextFrame } from '@brightspace-ui/testing';
import { stub, useFakeTimers } from 'sinon';
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

const noResolveTag = defineCE(
	class extends LoadingCompleteMixin(DummyMixin(LitElement)) {

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

	describe('console behaviour', () => {

		let clock, warnStub;
		beforeEach(() => {
			clock = useFakeTimers({ toFake: ['setTimeout'] });
			warnStub = stub(console, 'warn');

		});

		afterEach(() => {
			clock?.restore();
			warnStub?.restore();
		});

		it('logs a console warning when resolveLoadingComplete is not called', async() => {
			fixture(`<${noResolveTag}></${noResolveTag}>`);

			await nextFrame();
			clock.tick(30000);
			expect(warnStub).to.be.calledOnce;
		});

		it('does not log a console warning when resolveLoadingComplete if the element is disconnected', async() => {
			const elem = await fixture(`<${noResolveTag}></${noResolveTag}>`, { awaitLoadingComplete: false });
			elem.remove();
			clock.tick(30000);
			expect(warnStub).to.not.be.called;
		});

	});

});
