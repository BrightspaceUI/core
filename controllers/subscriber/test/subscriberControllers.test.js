
import { defineCE, expect, fixture, nextFrame } from '@open-wc/testing';
import { EventSubscriberController, IdSubscriberController, SubscriberRegistryController } from '../subscriberControllers.js';
import { LitElement } from 'lit-element/lit-element.js';
import sinon from 'sinon';

const separateRegistries = defineCE(
	class extends LitElement {
		constructor() {
			super();
			this._eventSubscribers = new SubscriberRegistryController(this,
				{ onSubscribe: this._onSubscribe.bind(this), onUnsubscribe: this._onUnsubscribe.bind(this), updateSubscribers: this._updateSubscribers.bind(this) },
				{ eventName: 'd2l-test-subscribe' }
			);

			this._idSubscribers = new SubscriberRegistryController(this,
				{ onSubscribe: this._onSubscribe.bind(this), onUnsubscribe: this._onUnsubscribe.bind(this), updateSubscribers: this._updateSubscribers.bind(this) },
				{}
			);
			this._onSubscribeTargets = [];
			this._onUnsubscribeTargets = [];
			this._updateSubscribersCalledWith = [];
		}
		getSubscriberController(controllerId) {
			if (controllerId === 'event') {
				return this._eventSubscribers;
			} else if (controllerId === 'id') {
				return this._idSubscribers;
			}
		}
		_onSubscribe(target) {
			this._onSubscribeTargets.push(target);
		}
		_onUnsubscribe(target) {
			this._onUnsubscribeTargets.push(target);
		}
		_updateSubscribers(subscribers) {
			this._updateSubscribersCalledWith.push(subscribers);
		}
	}
);

const combinedRegistry = defineCE(
	class extends LitElement {
		constructor() {
			super();
			this._subscribers = new SubscriberRegistryController(this,
				{ onSubscribe: this._onSubscribe.bind(this), onUnsubscribe: this._onUnsubscribe.bind(this), updateSubscribers: this._updateSubscribers.bind(this) },
				{ eventName: 'd2l-test-subscribe' }
			);
			this._onSubscribeTargets = [];
			this._onUnsubscribeTargets = [];
			this._updateSubscribersCalledWith = [];
		}
		getSubscriberController() {
			return this._subscribers;
		}
		_onSubscribe(target) {
			this._onSubscribeTargets.push(target);
		}
		_onUnsubscribe(target) {
			this._onUnsubscribeTargets.push(target);
		}
		_updateSubscribers(subscribers) {
			this._updateSubscribersCalledWith.push(subscribers);
		}
	}
);

const eventSubscriber = defineCE(
	class extends LitElement {
		constructor() {
			super();
			this._subscriberController = new EventSubscriberController(this,
				{ onError: this._onError.bind(this), onSubscribe: this._onSubscribe.bind(this) },
				{ eventName: 'd2l-test-subscribe', controllerId: 'event' }
			);
			this._onSubscribeRegistry = null;
			this._onError = false;
		}
		_onError() {
			this._onError = true;
		}
		_onSubscribe(registry) {
			this._onSubscribeRegistry = registry;
		}
	}
);

const idSubscriber = defineCE(
	class extends LitElement {
		static get properties() {
			return {
				for: { type: String }
			};
		}
		constructor() {
			super();
			this._subscriberController = new IdSubscriberController(this,
				{ onError: this._onError.bind(this), onSubscribe: this._onSubscribe.bind(this), onUnsubscribe: this._onUnsubscribe.bind(this) },
				{ idPropertyName: 'for', controllerId: 'id' }
			);
			this._onErrorRegistryIds = [];
			this._onSubscribeRegistries = [];
			this._onUnsubscribeRegistryIds = [];
		}
		_onError(registryId) {
			this._onErrorRegistryIds.push(registryId);
		}
		_onSubscribe(registry) {
			this._onSubscribeRegistries.push(registry);
		}
		_onUnsubscribe(registryId) {
			this._onUnsubscribeRegistryIds.push(registryId);
		}
	}
);

describe('SubscriberRegistryController', () => {

	describe('With multiple different subscriber registries', () => {
		let elem, registry;

		beforeEach(async() => {
			elem = await fixture(`<div>
				<${separateRegistries} id="separate">
					<${eventSubscriber} id="event"></${eventSubscriber}>
				</${separateRegistries}>
				<${idSubscriber} id="id" for="separate"></${idSubscriber}>
			</div>`);
			await elem.updateComplete;
			registry = elem.querySelector('#separate');
		});

		it('Event and id subscribers were registered properly and onSubscribe was called', () => {
			expect(registry._eventSubscribers.subscribers.size).to.equal(1);
			expect(registry._eventSubscribers.subscribers.has(elem.querySelector('#event'))).to.be.true;
			expect(registry._idSubscribers.subscribers.size).to.equal(1);
			expect(registry._idSubscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;

			expect(registry._onSubscribeTargets.length).to.equal(2);
			expect(registry._onSubscribeTargets[0]).to.equal(elem.querySelector('#id'));
			expect(registry._onSubscribeTargets[1]).to.equal(elem.querySelector('#event'));
		});

		it('Additional subscribers can be subscribed manually', () => {
			const newNode = document.createElement('div');
			registry._eventSubscribers.subscribe(newNode);
			expect(registry._eventSubscribers.subscribers.size).to.equal(2);
			expect(registry._eventSubscribers.subscribers.has(newNode)).to.be.true;
			expect(registry._onSubscribeTargets.length).to.equal(3);
			expect(registry._onSubscribeTargets[2]).to.equal(newNode);

			registry._idSubscribers.subscribe(newNode);
			expect(registry._idSubscribers.subscribers.size).to.equal(2);
			expect(registry._idSubscribers.subscribers.has(newNode)).to.be.true;
			expect(registry._onSubscribeTargets.length).to.equal(4);
			expect(registry._onSubscribeTargets[3]).to.equal(newNode);
		});

		it('Event and id subscribers are unsubscribed properly and onUnsubscribe is called', async() => {
			expect(registry._onUnsubscribeTargets.length).to.equal(0);

			let removed = elem.querySelector('#event');
			removed.remove();
			await registry.updateComplete;
			expect(registry._eventSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets.length).to.equal(1);
			expect(registry._onUnsubscribeTargets[0]).to.equal(removed);

			removed = elem.querySelector('#id');
			removed.remove();
			await registry.updateComplete;
			expect(registry._idSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets.length).to.equal(2);
			expect(registry._onUnsubscribeTargets[1]).to.equal(removed);
		});

		it('Subscribers can be unsubscribed manually', () => {
			let removed = elem.querySelector('#event');
			registry._eventSubscribers.unsubscribe(removed);
			expect(registry._eventSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets.length).to.equal(1);
			expect(registry._onUnsubscribeTargets[0]).to.equal(removed);

			removed = elem.querySelector('#id');
			registry._idSubscribers.unsubscribe(removed);
			expect(registry._idSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets.length).to.equal(2);
			expect(registry._onUnsubscribeTargets[1]).to.equal(removed);
		});

		it('Calls to updateSubscribers are debounced', async() => {
			expect(registry._updateSubscribersCalledWith.length).to.equal(0);

			registry._idSubscribers.updateSubscribers();
			registry._eventSubscribers.updateSubscribers();
			registry._eventSubscribers.updateSubscribers();
			registry._idSubscribers.updateSubscribers();
			registry._idSubscribers.updateSubscribers();
			registry._eventSubscribers.updateSubscribers();
			await nextFrame();
			await nextFrame();
			expect(registry._updateSubscribersCalledWith.length).to.equal(2);
			expect(registry._updateSubscribersCalledWith[0]).to.equal(registry._idSubscribers.subscribers);
			expect(registry._updateSubscribersCalledWith[1]).to.equal(registry._eventSubscribers.subscribers);
		});
	});

	describe('With both event and id subscribers added to the same registry', () => {
		let elem, registry;

		beforeEach(async() => {
			elem = await fixture(`<div>
				<${combinedRegistry} id="combined">
					<${eventSubscriber} id="event"></${eventSubscriber}>
				</${combinedRegistry}>
				<${idSubscriber} id="id" for="combined"></${idSubscriber}>
			</div>`);
			await elem.updateComplete;
			registry = elem.querySelector('#combined');
		});

		it('Event and id subscribers were registered properly and onSubscribe was called', () => {
			expect(registry._subscribers.subscribers.size).to.equal(2);
			expect(registry._subscribers.subscribers.has(elem.querySelector('#event'))).to.be.true;
			expect(registry._subscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;

			expect(registry._onSubscribeTargets.length).to.equal(2);
			expect(registry._onSubscribeTargets[0]).to.equal(elem.querySelector('#id'));
			expect(registry._onSubscribeTargets[1]).to.equal(elem.querySelector('#event'));
		});

		it('Additional subscribers can be subscribed manually', () => {
			const newNode = document.createElement('div');
			registry._subscribers.subscribe(newNode);
			expect(registry._subscribers.subscribers.size).to.equal(3);
			expect(registry._subscribers.subscribers.has(newNode)).to.be.true;
			expect(registry._onSubscribeTargets.length).to.equal(3);
			expect(registry._onSubscribeTargets[2]).to.equal(newNode);
		});

		it('Event and id subscribers are unsubscribed properly and onUnsubscribe is called', async() => {
			expect(registry._onUnsubscribeTargets.length).to.equal(0);

			let removed = elem.querySelector('#event');
			removed.remove();
			await registry.updateComplete;
			expect(registry._subscribers.subscribers.size).to.equal(1);
			expect(registry._onUnsubscribeTargets.length).to.equal(1);
			expect(registry._onUnsubscribeTargets[0]).to.equal(removed);
			expect(registry._subscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;

			removed = elem.querySelector('#id');
			removed.remove();
			await registry.updateComplete;
			expect(registry._subscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets.length).to.equal(2);
			expect(registry._onUnsubscribeTargets[1]).to.equal(removed);
		});

		it('Subscribers can be unsubscribed manually', () => {
			let removed = elem.querySelector('#event');
			registry._subscribers.unsubscribe(removed);
			expect(registry._subscribers.subscribers.size).to.equal(1);
			expect(registry._onUnsubscribeTargets.length).to.equal(1);
			expect(registry._onUnsubscribeTargets[0]).to.equal(removed);
			expect(registry._subscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;

			removed = elem.querySelector('#id');
			registry._subscribers.unsubscribe(removed);
			expect(registry._subscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets.length).to.equal(2);
			expect(registry._onUnsubscribeTargets[1]).to.equal(removed);
		});

		it('Calls to updateSubscribers are debounced', async() => {
			expect(registry._updateSubscribersCalledWith.length).to.equal(0);

			registry._subscribers.updateSubscribers();
			registry._subscribers.updateSubscribers();
			registry._subscribers.updateSubscribers();
			await nextFrame();
			await nextFrame();
			expect(registry._updateSubscribersCalledWith.length).to.equal(1);
			expect(registry._updateSubscribersCalledWith[0]).to.equal(registry._subscribers.subscribers);
		});
	});
});

describe('EventSubscriberController', () => {
	let elem;

	beforeEach(async() => {
		elem = await fixture(`<div>
			<${separateRegistries} id="registry">
				<${eventSubscriber} id="success"></${eventSubscriber}>
			</${separateRegistries}>
			<${eventSubscriber} id="error"></${eventSubscriber}>
		</div>`);
		await elem.updateComplete;
	});

	it('Call onSubscribe after subscribing and getting the registry component', () => {
		const subscriber = elem.querySelector('#success');
		expect(subscriber._onSubscribeRegistry).to.equal(elem.querySelector('#registry'));
		expect(subscriber._onError).to.be.false;
	});

	it('Call onError if we did not find a registry component', () => {
		const subscriber = elem.querySelector('#error');
		expect(subscriber._onSubscribeRegistry).to.be.null;
		expect(subscriber._onError).to.be.true;
	});
});

describe('IdSubscriberController', () => {
	let elem;
	const fixtureHtml = `<div>
		<${separateRegistries} id="registry-1">
			<${idSubscriber} id="nested" for="registry-1"></${idSubscriber}>
		</${separateRegistries}>
		<${separateRegistries} id="registry-2"></${separateRegistries}>
		<${idSubscriber} id="single" for="registry-1"></${idSubscriber}>
		<${idSubscriber} id="multiple" for="registry-1 registry-2 non-existant"></${idSubscriber}>
		<${idSubscriber} id="error" for="non-existant"></${idSubscriber}>
	</div>`;

	describe('Adding and removing', () => {
		beforeEach(async() => {
			elem = await fixture(fixtureHtml);
			await elem.updateComplete;
		});

		it('Call onSubscribe after subscribing and getting the registry component', () => {
			const nestedSubscriber = elem.querySelector('#nested');
			expect(nestedSubscriber._onSubscribeRegistries.length).to.equal(1);
			expect(nestedSubscriber._onSubscribeRegistries[0]).to.equal(elem.querySelector('#registry-1'));

			const singleSubscriber = elem.querySelector('#single');
			expect(singleSubscriber._onSubscribeRegistries.length).to.equal(1);
			expect(singleSubscriber._onSubscribeRegistries[0]).to.equal(elem.querySelector('#registry-1'));

			const multipleSubscriber = elem.querySelector('#multiple');
			expect(multipleSubscriber._onSubscribeRegistries.length).to.equal(2);
			expect(multipleSubscriber._onSubscribeRegistries[0]).to.equal(elem.querySelector('#registry-1'));
			expect(multipleSubscriber._onSubscribeRegistries[1]).to.equal(elem.querySelector('#registry-2'));
		});

		it('If a registry component is removed, registry maps are updated', async() => {
			const registry1 = elem.querySelector('#registry-1');
			const registry2 = elem.querySelector('#registry-2');
			const singleSubscriber = elem.querySelector('#single');
			const multipleSubscriber = elem.querySelector('#multiple');
			expect(singleSubscriber._onUnsubscribeRegistryIds.length).to.equal(0);
			expect(multipleSubscriber._onUnsubscribeRegistryIds.length).to.equal(0);

			registry1.remove();
			await singleSubscriber.updateComplete;
			await multipleSubscriber.updateComplete;

			expect(singleSubscriber._onUnsubscribeRegistryIds.length).to.equal(1);
			expect(singleSubscriber._onUnsubscribeRegistryIds[0]).to.equal('registry-1');
			expect(singleSubscriber._subscriberController.registries.length).to.equal(0);
			expect(multipleSubscriber._onUnsubscribeRegistryIds.length).to.equal(1);
			expect(multipleSubscriber._onUnsubscribeRegistryIds[0]).to.equal('registry-1');
			expect(multipleSubscriber._subscriberController.registries.length).to.equal(1);
			expect(multipleSubscriber._subscriberController.registries[0]).to.equal(registry2);
		});

		it('If a registry component is added, the registry and subscriber maps are updated', async() => {
			const errorSubscriber = elem.querySelector('#error');
			const multipleSubscriber = elem.querySelector('#multiple');
			expect(errorSubscriber._onSubscribeRegistries.length).to.equal(0);
			expect(errorSubscriber._subscriberController.registries.length).to.equal(0);
			expect(multipleSubscriber._onSubscribeRegistries.length).to.equal(2);
			expect(multipleSubscriber._subscriberController.registries.length).to.equal(2);

			const newNode = document.createElement(`${combinedRegistry}`);
			newNode.id = 'non-existant';
			elem.appendChild(newNode);
			await newNode.updateComplete;

			expect(errorSubscriber._onSubscribeRegistries.length).to.equal(1);
			expect(errorSubscriber._onSubscribeRegistries[0]).to.equal(newNode);
			expect(errorSubscriber._subscriberController.registries.length).to.equal(1);
			expect(errorSubscriber._subscriberController.registries[0]).to.equal(newNode);
			expect(multipleSubscriber._onSubscribeRegistries.length).to.equal(3);
			expect(multipleSubscriber._onSubscribeRegistries[2]).to.equal(newNode);
			expect(multipleSubscriber._subscriberController.registries.length).to.equal(3);
			expect(multipleSubscriber._subscriberController.registries[2]).to.equal(newNode);
			expect(newNode.getSubscriberController().subscribers.size).to.equal(2);
			expect(newNode.getSubscriberController().subscribers.has(errorSubscriber)).to.be.true;
			expect(newNode.getSubscriberController().subscribers.has(multipleSubscriber)).to.be.true;
		});

		it('If the list of registry ids changes, the registry and subscriber maps are updated', async() => {
			const registry1 = elem.querySelector('#registry-1');
			const registry2 = elem.querySelector('#registry-2');
			const singleSubscriber = elem.querySelector('#single');
			expect(singleSubscriber._onUnsubscribeRegistryIds.length).to.equal(0);
			expect(singleSubscriber._subscriberController.registries.length).to.equal(1);
			expect(singleSubscriber._subscriberController.registries[0]).to.equal(registry1);
			expect(registry1.getSubscriberController('id').subscribers.has(singleSubscriber)).to.be.true;
			expect(registry2.getSubscriberController('id').subscribers.has(singleSubscriber)).to.be.false;

			singleSubscriber.for = 'registry-2';
			await singleSubscriber.updateComplete;

			expect(singleSubscriber._onSubscribeRegistries.length).to.equal(2);
			expect(singleSubscriber._onSubscribeRegistries[1]).to.equal(registry2);
			expect(singleSubscriber._onUnsubscribeRegistryIds.length).to.equal(1);
			expect(singleSubscriber._onUnsubscribeRegistryIds[0]).to.equal('registry-1');
			expect(singleSubscriber._subscriberController.registries.length).to.equal(1);
			expect(singleSubscriber._subscriberController.registries[0]).to.equal(registry2);
			expect(registry1.getSubscriberController('id').subscribers.has(singleSubscriber)).to.be.false;
			expect(registry2.getSubscriberController('id').subscribers.has(singleSubscriber)).to.be.true;
		});
	});

	describe('Error handling', () => {
		let clock;

		beforeEach(async() => {
			clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
			elem = await fixture(fixtureHtml);
			await elem.updateComplete;
		});
		afterEach(() => {
			clock.restore();
		});

		it('Call onError if we did not find a registry component with the provided id', async() => {
			const errorSubscriber = elem.querySelector('#error');
			const multipleSubscriber = elem.querySelector('#multiple');
			expect(errorSubscriber._onErrorRegistryIds).to.be.empty;
			expect(multipleSubscriber._onErrorRegistryIds).to.be.empty;

			clock.tick(2999);
			expect(errorSubscriber._onErrorRegistryIds).to.be.empty;
			expect(multipleSubscriber._onErrorRegistryIds).to.be.empty;
			clock.tick(1);

			expect(errorSubscriber._onSubscribeRegistries).to.be.empty;
			expect(errorSubscriber._onErrorRegistryIds.length).to.equal(1);
			expect(errorSubscriber._onErrorRegistryIds[0]).to.equal('non-existant');
			expect(multipleSubscriber._onSubscribeRegistries.length).to.equal(2);
			expect(multipleSubscriber._onSubscribeRegistries[0]).to.equal(elem.querySelector('#registry-1'));
			expect(multipleSubscriber._onSubscribeRegistries[1]).to.equal(elem.querySelector('#registry-2'));
			expect(multipleSubscriber._onErrorRegistryIds.length).to.equal(1);
			expect(multipleSubscriber._onErrorRegistryIds[0]).to.equal('non-existant');
		});
	});
});
