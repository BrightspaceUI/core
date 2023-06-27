
import { defineCE, expect, fixture, nextFrame } from '@brightspace-ui/testing';
import { EventSubscriberController, IdSubscriberController, SubscriberRegistryController } from '../subscriberControllers.js';
import { html, LitElement } from 'lit';
import sinon from 'sinon';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const registries = defineCE(
	class extends LitElement {
		constructor() {
			super();

			this._eventSubscribers = new SubscriberRegistryController(this, 'test-subscribe-event', {
				onSubscribe: this._onSubscribe.bind(this),
				onUnsubscribe: this._onUnsubscribe.bind(this),
				updateSubscribers: this._updateSubscribers.bind(this)
			});
			this._idSubscribers = new SubscriberRegistryController(this, 'test-subscribe-id', {
				onSubscribe: this._onSubscribe.bind(this),
				onUnsubscribe: this._onUnsubscribe.bind(this),
				updateSubscribers: this._updateSubscribers.bind(this)
			});
			this._combinedSubscribers = new SubscriberRegistryController(this, 'test-subscribe', {
				onSubscribe: this._onSubscribe.bind(this),
				onUnsubscribe: this._onUnsubscribe.bind(this),
				updateSubscribers: this._updateSubscribers.bind(this)
			});

			this._onSubscribeTargets = [];
			this._onUnsubscribeTargets = [];
			this._updateSubscribersCalledWith = [];
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

const generateSubscriber = (type, name) => class extends LitElement {
	static get properties() {
		return {
			for: { type: String }
		};
	}
	constructor() {
		super();

		const isIdController = type === 'id';
		const Controller = isIdController ? IdSubscriberController : EventSubscriberController;
		const extraOptions = isIdController ? { idPropertyName: 'for', onUnsubscribe: this._onUnsubscribe.bind(this) } : {};

		this._subscriberController = new Controller(this, name, {
			onError: this._onError.bind(this),
			onSubscribe: this._onSubscribe.bind(this),
			...extraOptions
		});

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
};

const eventSubscriberSeparate = defineCE(generateSubscriber('event', 'test-subscribe-event'));
const eventSubscriberCombined = defineCE(generateSubscriber('event', 'test-subscribe'));
const idSubscriberSeparate = defineCE(generateSubscriber('id', 'test-subscribe-id'));
const idSubscriberCombined = defineCE(generateSubscriber('id', 'test-subscribe'));

const indirectSlotRegistries = defineCE(class extends LitElement {
	render() {
		return html`${unsafeHTML(`
			<${registries} id="registry-shadow">
				<slot></slot>
			</${registries}>
		`)}`;
	}
});

describe('SubscriberRegistryController', () => {

	describe('With multiple different subscriber registries', () => {
		let elem, registry;

		beforeEach(async() => {
			elem = await fixture(`<div>
				<${registries} id="registry">
					<${eventSubscriberSeparate} id="event"></${eventSubscriberSeparate}>
				</${registries}>
				<${idSubscriberSeparate} id="id" for="registry"></${idSubscriberSeparate}>
			</div>`);
			registry = elem.querySelector('#registry');
		});

		it('Event and id subscribers were registered properly and onSubscribe was called', () => {
			expect(registry._eventSubscribers.subscribers.size).to.equal(1);
			expect(registry._eventSubscribers.subscribers.has(elem.querySelector('#event'))).to.be.true;
			expect(registry._idSubscribers.subscribers.size).to.equal(1);
			expect(registry._idSubscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;
			expect(registry._onSubscribeTargets).to.eql([ elem.querySelector('#event'), elem.querySelector('#id') ]);
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
			expect(registry._onUnsubscribeTargets).to.eql([]);

			const eventElem = elem.querySelector('#event');
			eventElem.remove();
			await registry.updateComplete;
			expect(registry._eventSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem ]);

			const idElem = elem.querySelector('#id');
			idElem.remove();
			await registry.updateComplete;
			expect(registry._idSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem, idElem ]);
		});

		it('Subscribers can be unsubscribed manually', () => {
			const eventElem = elem.querySelector('#event');
			registry._eventSubscribers.unsubscribe(eventElem);
			expect(registry._eventSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem ]);

			const idElem = elem.querySelector('#id');
			registry._idSubscribers.unsubscribe(idElem);
			expect(registry._idSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem, idElem ]);
		});

		it('Calls to updateSubscribers are debounced', async() => {
			expect(registry._updateSubscribersCalledWith).to.eql([]);

			registry._idSubscribers.updateSubscribers();
			registry._eventSubscribers.updateSubscribers();
			registry._eventSubscribers.updateSubscribers();
			registry._idSubscribers.updateSubscribers();
			registry._idSubscribers.updateSubscribers();
			registry._eventSubscribers.updateSubscribers();
			await nextFrame();
			await nextFrame();
			expect(registry._updateSubscribersCalledWith).to.eql([ registry._idSubscribers.subscribers, registry._eventSubscribers.subscribers ]);
		});
	});

	describe('With both event and id subscribers added to the same registry', () => {
		let elem, registry;

		beforeEach(async() => {
			elem = await fixture(`<div>
				<${registries} id="registry">
					<${eventSubscriberCombined} id="event"></${eventSubscriberCombined}>
				</${registries}>
				<${idSubscriberCombined} id="id" for="registry"></${idSubscriberCombined}>
			</div>`);
			registry = elem.querySelector('#registry');
		});

		it('Event and id subscribers were registered properly and onSubscribe was called', () => {
			expect(registry._combinedSubscribers.subscribers.size).to.equal(2);
			expect(registry._combinedSubscribers.subscribers.has(elem.querySelector('#event'))).to.be.true;
			expect(registry._combinedSubscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;
			expect(registry._onSubscribeTargets).to.eql([ elem.querySelector('#event'), elem.querySelector('#id') ]);
		});

		it('Additional subscribers can be subscribed manually', () => {
			const newNode = document.createElement('div');
			registry._combinedSubscribers.subscribe(newNode);
			expect(registry._combinedSubscribers.subscribers.size).to.equal(3);
			expect(registry._combinedSubscribers.subscribers.has(newNode)).to.be.true;
			expect(registry._onSubscribeTargets.length).to.equal(3);
			expect(registry._onSubscribeTargets[2]).to.equal(newNode);
		});

		it('Event and id subscribers are unsubscribed properly and onUnsubscribe is called', async() => {
			expect(registry._onUnsubscribeTargets).to.eql([]);

			const eventElem = elem.querySelector('#event');
			eventElem.remove();
			await registry.updateComplete;
			expect(registry._combinedSubscribers.subscribers.size).to.equal(1);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem ]);
			expect(registry._combinedSubscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;

			const idElem = elem.querySelector('#id');
			idElem.remove();
			await registry.updateComplete;
			expect(registry._combinedSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem, idElem ]);
		});

		it('Subscribers can be unsubscribed manually', () => {
			const eventElem = elem.querySelector('#event');
			registry._combinedSubscribers.unsubscribe(eventElem);
			expect(registry._combinedSubscribers.subscribers.size).to.equal(1);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem ]);
			expect(registry._combinedSubscribers.subscribers.has(elem.querySelector('#id'))).to.be.true;

			const idElem = elem.querySelector('#id');
			registry._combinedSubscribers.unsubscribe(idElem);
			expect(registry._combinedSubscribers.subscribers.size).to.equal(0);
			expect(registry._onUnsubscribeTargets).to.eql([ eventElem, idElem ]);
		});

		it('Calls to updateSubscribers are debounced', async() => {
			expect(registry._updateSubscribersCalledWith).to.eql([]);

			registry._combinedSubscribers.updateSubscribers();
			registry._combinedSubscribers.updateSubscribers();
			registry._combinedSubscribers.updateSubscribers();
			await nextFrame();
			await nextFrame();
			expect(registry._updateSubscribersCalledWith).to.eql([ registry._combinedSubscribers.subscribers ]);
		});
	});
});

describe('EventSubscriberController', () => {
	let elem, clock;

	beforeEach(async() => {
		clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
		elem = await fixture(`<div>
			<${registries} id="registry">
				<${eventSubscriberSeparate} id="success"></${eventSubscriberSeparate}>
			</${registries}>
			<${indirectSlotRegistries} id="registry-wrapper">
				<${eventSubscriberSeparate} id="delayed"></${eventSubscriberSeparate}>
			</${indirectSlotRegistries}>
			<${eventSubscriberSeparate} id="error"></${eventSubscriberSeparate}>
		</div>`);
	});

	afterEach(() => {
		clock.restore();
	});

	it('Call onSubscribe after subscribing and getting the registry component', () => {
		const subscriber = elem.querySelector('#success');
		expect(subscriber._onSubscribeRegistries).to.eql([ elem.querySelector('#registry') ]);
		expect(subscriber._onErrorRegistryIds).to.eql([]);
	});

	it('Call onError if we did not find a registry component', () => {
		const subscriber = elem.querySelector('#error');

		clock.tick(400);
		expect(subscriber._onSubscribeRegistries).to.eql([]);
		expect(subscriber._onErrorRegistryIds).to.eql([ undefined ]);
	});

	it('should keep checking if the registry is not immediately found', () => {
		const subscriber = elem.querySelector('#delayed');
		expect(subscriber._onSubscribeRegistries).to.eql([]);

		clock.tick(40);
		expect(subscriber._onSubscribeRegistries).to.eql([ elem.querySelector('#registry-wrapper').shadowRoot.querySelector('#registry-shadow') ]);
		expect(subscriber._onErrorRegistryIds).to.eql([]);
	});
});

describe('IdSubscriberController', () => {
	let elem, clock;

	const fixtureHtml = `<div>
		<${registries} id="registry-1">
			<${idSubscriberSeparate} id="nested" for="registry-1"></${idSubscriberSeparate}>
		</${registries}>
		<${registries} id="registry-2"></${registries}>
		<${registries} id="registry-3"></${registries}>
		<${idSubscriberSeparate} id="single" for="registry-1"></${idSubscriberSeparate}>
		<${idSubscriberSeparate} id="multiple" for="registry-1 registry-2 non-existant "></${idSubscriberSeparate}>
		<${idSubscriberSeparate} id="delayed" for="registry-3-changed"></${idSubscriberSeparate}>
		<${idSubscriberSeparate} id="error" for="non-existant"></${idSubscriberSeparate}>
	</div>`;

	describe('Adding and removing', () => {
		beforeEach(async() => {
			clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
			elem = await fixture(fixtureHtml);
		});

		afterEach(() => {
			clock.restore();
		});

		it('Call onSubscribe after subscribing and getting the registry component', () => {
			const nestedSubscriber = elem.querySelector('#nested');
			expect(nestedSubscriber._onSubscribeRegistries).to.eql([ elem.querySelector('#registry-1') ]);

			const singleSubscriber = elem.querySelector('#single');
			expect(singleSubscriber._onSubscribeRegistries).to.eql([ elem.querySelector('#registry-1') ]);

			const multipleSubscriber = elem.querySelector('#multiple');
			expect(multipleSubscriber._onSubscribeRegistries).to.eql([ elem.querySelector('#registry-1'), elem.querySelector('#registry-2') ]);
		});

		it('If a registry component is removed, registry maps are updated', async() => {
			const registry1 = elem.querySelector('#registry-1');
			const registry2 = elem.querySelector('#registry-2');
			const singleSubscriber = elem.querySelector('#single');
			const multipleSubscriber = elem.querySelector('#multiple');
			expect(singleSubscriber._onUnsubscribeRegistryIds).to.eql([]);
			expect(multipleSubscriber._onUnsubscribeRegistryIds).to.eql([]);

			registry1.remove();
			await singleSubscriber.updateComplete;
			await multipleSubscriber.updateComplete;

			expect(singleSubscriber._onUnsubscribeRegistryIds).to.eql([ 'registry-1' ]);
			expect(singleSubscriber._subscriberController.registries).to.eql([]);
			expect(multipleSubscriber._onUnsubscribeRegistryIds).to.eql([ 'registry-1' ]);
			expect(multipleSubscriber._subscriberController.registries).to.eql([ registry2 ]);
		});

		it('If a registry component is added, the registry and subscriber maps are updated', async() => {
			const errorSubscriber = elem.querySelector('#error');
			const multipleSubscriber = elem.querySelector('#multiple');
			expect(errorSubscriber._onSubscribeRegistries).to.eql([]);
			expect(errorSubscriber._subscriberController.registries).to.eql([]);
			expect(multipleSubscriber._onSubscribeRegistries.length).to.equal(2);
			expect(multipleSubscriber._subscriberController.registries.length).to.equal(2);

			const newNode = document.createElement(`${registries}`);
			newNode.id = 'non-existant';
			elem.appendChild(newNode);
			await newNode.updateComplete;

			expect(errorSubscriber._onSubscribeRegistries).to.eql([ newNode ]);
			expect(errorSubscriber._subscriberController.registries).to.eql([ newNode ]);
			expect(multipleSubscriber._onSubscribeRegistries.length).to.equal(3);
			expect(multipleSubscriber._onSubscribeRegistries[2]).to.equal(newNode);
			expect(multipleSubscriber._subscriberController.registries.length).to.equal(3);
			expect(multipleSubscriber._subscriberController.registries[2]).to.equal(newNode);
			expect(newNode._idSubscribers.subscribers.size).to.equal(2);
			expect(newNode._idSubscribers.subscribers.has(errorSubscriber)).to.be.true;
			expect(newNode._idSubscribers.subscribers.has(multipleSubscriber)).to.be.true;
		});

		it('If the list of registry ids changes, the registry and subscriber maps are updated', async() => {
			const registry1 = elem.querySelector('#registry-1');
			const registry2 = elem.querySelector('#registry-2');
			const singleSubscriber = elem.querySelector('#single');
			expect(singleSubscriber._onSubscribeRegistries).to.eql([ registry1 ]);
			expect(singleSubscriber._onUnsubscribeRegistryIds).to.eql([]);
			expect(singleSubscriber._subscriberController.registries).to.eql([ registry1 ]);
			expect(registry1._idSubscribers.subscribers.has(singleSubscriber)).to.be.true;
			expect(registry2._idSubscribers.subscribers.has(singleSubscriber)).to.be.false;

			singleSubscriber.for = 'registry-2';
			await singleSubscriber.updateComplete;

			expect(singleSubscriber._onSubscribeRegistries).to.eql([ registry1, registry2 ]);
			expect(singleSubscriber._onUnsubscribeRegistryIds).to.eql([ 'registry-1' ]);
			expect(singleSubscriber._subscriberController.registries).to.eql([ registry2 ]);
			expect(registry1._idSubscribers.subscribers.has(singleSubscriber)).to.be.false;
			expect(registry2._idSubscribers.subscribers.has(singleSubscriber)).to.be.true;
		});

		it('should keep checking if the registry is not immediately found', () => {
			const subscriber = elem.querySelector('#delayed');
			const registry3 = elem.querySelector('#registry-3');

			registry3.id = 'registry-3-changed';
			expect(subscriber._onSubscribeRegistries).to.eql([]);

			clock.tick(100);
			expect(subscriber._onSubscribeRegistries).to.eql([ registry3 ]);
			expect(subscriber._onErrorRegistryIds).to.eql([]);
		});
	});

	describe('Error handling', () => {
		let clock;

		beforeEach(async() => {
			clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
			elem = await fixture(fixtureHtml);
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
			expect(errorSubscriber._onErrorRegistryIds).to.eql([ 'non-existant' ]);
			expect(multipleSubscriber._onSubscribeRegistries).to.eql([ elem.querySelector('#registry-1'), elem.querySelector('#registry-2') ]);
			expect(multipleSubscriber._onErrorRegistryIds).to.eql([ 'non-existant' ]);
		});
	});
});
