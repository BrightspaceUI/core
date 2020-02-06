# @brightspace-ui/core

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/core.svg)](https://www.npmjs.org/package/@brightspace-ui/core)
[![NPM downloads](https://img.shields.io/npm/dt/@brightspace-ui/core.svg)](https://www.npmjs.com/package/@brightspace-ui/core)
[![Greenkeeper badge](https://badges.greenkeeper.io/BrightspaceUI/core.svg)](https://greenkeeper.io/)
[![Build status](https://travis-ci.com/BrightspaceUI/core.svg?branch=master)](https://travis-ci.com/BrightspaceUI/core)

A collection of accessible, free, open-source web components and tools for building Brightspace applications.

## Installation

```shell
npm install @brightspace-ui/core
```

## README Index

* Components
 - [Buttons](components/button/): normal, primary, icon and subtle buttons
 - [Colors](components/colors/): color palette
 - [Dialogs](components/dialog/): generic and confirmation dialogs
 - [Icons](components/icons/): iconography SVGs and web components
 - [Inputs](components/inputs/): text, search, select, checkbox and radio inputs
 - [Links](components/link/): link component and styles
 - [List](components/list/): list and list-item components
 - [Loading Spinner](components/loading-spinner/): loading-spinner components
 - [Meter](components/meter/): linear, radial, circle meter web components
 - [More/less](components/more-less/): constrain long bits of content
 - [Off-screen](components/offscreen/): component and styles for positioning content off-screen
 - [Status Indicator](components/status-indicator/): status-indicator components
 - [Typography](components/typography/): typography styles and components
* Helpers
 - [Helpers](helpers/): helpers for composed DOM, unique ids, etc.
* Mixins
 - [ArrowKeysMixin](mixins/arrow-keys-mixin.md): manage focus with arrow keys
 - [AsyncContainerMixin](mixins/async-container/): manage collective async state
 - [LocalizeMixin](mixins/localize-mixin.md): localize text in your components
 - [ProviderMixin](mixins/provider-mixin.md): provide and consume data across elements in a DI-like fashion
 - [RtlMixin](mixins/rtl-mixin.md): enable components to define RTL styles
 - [VisibleOnAncestorMixin](mixins/visible-on-ancestor-mixin.md): display element on-hover of an ancestor
* Templates
 - [PrimarySecondaryTemplate](templates/primary-secondary): Two Panel (primary and secondary) page template with header and optional footer

## Developing

After cloning the repo, run `npm install` to install dependencies.

Run `npm run build` once, or any time icon or Sass files are changed.

### Running the demos

Start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo pages:

```shell
npm start
```

### Linting

To lint (eslint and [lit-analyzer](https://github.com/runem/lit-analyzer/tree/master/packages/lit-analyzer)):

```shell
npm run lint
```

Or individually as `npm run lint:eslint` and `npm run lint:lit`.

### Testing

Lint, unit test and visual-diff test:

```shell
npm test
```

To run local unit tests:

```shell
npm run test:headless
```

To debug or run a subset of local unit tests:

```shell
npm run test:headless:watch
```

Then navigate to `http://localhost:9876/debug.html`.

### Visual Diff Testing

To run visual-diff tests:

```shell
npm run test:diff
```

To run a subset of visual-diff tests:

```shell
npm run test:diff -- -g some-pattern
```

To update visual-diff goldens:

```shell
npm run test:diff:golden
```

Visual-diff goldens in source control must be updated by Travis CI. To trigger an update, press the "Regenerate Goldens" button in the pull request `visual-difference` test run.

## Future Enhancements

Looking for a new component or an enhancement not listed here? Create a GitHub issue!

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version, create a tag, and trigger a deployment to NPM.
