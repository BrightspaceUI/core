import { provideInstance, ProviderDelegate, requestInstance } from '../provider-mixin.js';
import { expect } from '@brightspace-ui/testing';

describe('provider-helpers', () => {

	it('should provide number', () => {
		provideInstance(document, 'instance-number', 42);
		expect(requestInstance(document.body, 'instance-number')).to.equal(42);
	});

	it('should provide string', () => {
		provideInstance(document, 'instance-number', 'forty-two');
		expect(requestInstance(document.body, 'instance-number')).to.equal('forty-two');
	});

	it('should provide boolean', () => {
		provideInstance(document, 'instance-boolean', true);
		expect(requestInstance(document.body, 'instance-boolean')).to.equal(true);
	});

	it('should provide function', () => {
		const someFunction = () => {};
		provideInstance(document, 'instance-function', someFunction);
		expect(requestInstance(document.body, 'instance-function')).to.equal(someFunction);
	});

	it('should provide object', () => {
		class Beverage {
			constructor(type) {
				this.type = type;
			}
		}
		const instance = new Beverage('beer');
		provideInstance(document, 'instance-object', instance);
		expect(requestInstance(document.body, 'instance-object')).to.equal(instance);
	});

	it('should provide delegate result', () => {
		provideInstance(document, 'instance-delegate', new ProviderDelegate(() => {
			return 42;
		}));
		expect(requestInstance(document.body, 'instance-delegate')).to.equal(42);
	});

	it('should provide cached delegate result', () => {
		let value = 41;
		provideInstance(document, 'instance-delegate', new ProviderDelegate(() => {
			value += 1;
			return value;
		}));
		expect(requestInstance(document.body, 'instance-delegate')).to.equal(42);
		expect(requestInstance(document.body, 'instance-delegate')).to.equal(42);
	});

	it('should provide new delegate result', () => {
		let value = 41;
		provideInstance(document, 'instance-delegate', new ProviderDelegate(() => {
			value += 1;
			return value;
		}, true));
		expect(requestInstance(document.body, 'instance-delegate')).to.equal(42);
		expect(requestInstance(document.body, 'instance-delegate')).to.equal(43);
	});

	it('should provide async delegate result', async() => {
		provideInstance(document, 'instance-async-delegate', new ProviderDelegate(() => {
			return new Promise(resolve => resolve(42));
		}));
		expect(await requestInstance(document.body, 'instance-async-delegate')).to.equal(42);
	});

});
