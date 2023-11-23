import { getPlugin, getPlugins, registerPlugin, resetPlugins } from '../plugins.js';
import { expect } from '@brightspace-ui/testing';

describe('plugins', () => {

	afterEach(() => {
		resetPlugins();
	});

	describe('default', () => {

		beforeEach(() => {
			registerPlugin('test-plugins', { prop1: 'beer' });
			registerPlugin('test-plugins', { prop1: 'donuts' });
		});

		it('getPlugins should return empty array for invalid plugin set key', () => {
			const plugins = getPlugins('invalid-plugin-set-key');
			expect(plugins.length).to.equal(0);
		});

		it('getPlugins should return array of plugins in registration order', () => {
			const plugins = getPlugins('test-plugins');
			expect(plugins.length).to.equal(2);
			expect(plugins[0].prop1).to.equal('beer');
			expect(plugins[1].prop1).to.equal('donuts');
		});

		it('getPlugins should return copy of the array for each consumer', () => {
			const plugins1 = getPlugins('test-plugins');
			const plugins2 = getPlugins('test-plugins');
			expect(plugins1).not.to.equal(plugins2);
		});

	});

	describe('sorted', () => {

		beforeEach(() => {
			registerPlugin('test-plugins', { prop1: 'beer' }, { sort: 3 });
			registerPlugin('test-plugins', { prop1: 'donuts' }, { sort: 1 });
		});

		it('getPlugins should return array of plugins in sort order', () => {
			const plugins = getPlugins('test-plugins');
			expect(plugins.length).to.equal(2);
			expect(plugins[0].prop1).to.equal('donuts');
			expect(plugins[1].prop1).to.equal('beer');
		});

		it('getPlugins should return array of plugins in new sort order if additional plugins are registered', () => {
			let plugins = getPlugins('test-plugins');
			expect(plugins.length).to.equal(2);
			expect(plugins[0].prop1).to.equal('donuts');
			expect(plugins[1].prop1).to.equal('beer');

			registerPlugin('test-plugins', { prop1: 'candy apple' }, { sort: 2 });

			plugins = getPlugins('test-plugins');
			expect(plugins.length).to.equal(3);
			expect(plugins[0].prop1).to.equal('donuts');
			expect(plugins[1].prop1).to.equal('candy apple');
			expect(plugins[2].prop1).to.equal('beer');
		});

	});

	describe('keyed', () => {

		beforeEach(() => {
			registerPlugin('test-plugins', { prop1: 'beer' }, { key: 'plugin1' });
			registerPlugin('test-plugins', { prop1: 'donuts' }, { key: 'plugin2' });
		});

		it('getPlugin should return undefined for invalid plugin set key', () => {
			const plugin = getPlugin('invalid-plugin-set-key', 'plugin1');
			expect(plugin).to.equal(undefined);
		});

		it('getPlugin should return undefined for invalid plugin key', () => {
			const plugin = getPlugin('test-plugins', 'pluginx');
			expect(plugin).to.equal(undefined);
		});

		it('getPlugin should return plugin for specified keys', () => {
			const plugin = getPlugin('test-plugins', 'plugin1');
			expect(plugin.prop1).to.equal('beer');
		});

		it('registerPlugin should not throw when adding a plugin with key not used within the set', () => {
			expect(() => {
				registerPlugin('test-plugins-other', { prop1: 'candy apple' }, { key: 'plugin1' });
			}).to.not.throw();
		});

		it('registerPlugin should throw when adding a plugin with key already used within the set', () => {
			expect(() => {
				registerPlugin('test-plugins', { prop1: 'candy apple' }, { key: 'plugin1' });
			}).to.throw();
		});

	});

});
