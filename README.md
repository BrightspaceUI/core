# core

[![Greenkeeper badge](https://badges.greenkeeper.io/BrightspaceUI/core.svg)](https://greenkeeper.io/)

A collection of core UI components.

## Installation

Coming soon!

## Usage

### Structure

`/components/` - Web components for use in your composite components or application (ex. buttons, links, etc)

`/demo/` - Demos for components and mixins

`/helpers/` - Helpers for use in your web components or mixins (ex. composed DOM helpers)

`/mixins/` - Mixins for use in your web components (ex. localize, RTL, etc)

`/test/` - Unit and Visual-Diff tests

`/tools/` - Development tools for building, testing, etc. (this code does not get shipped)

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

### Running the demos

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

### Testing

To lint:

```shell
npm run lint
```

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

To run local unit tests:

```shell
npm run test:local
```

To run a subset of local unit tests, modify your local [index.html](https://github.com/BrightspaceUI/core/blob/master/test/index.html), or start the dev server and navigate to the desired test page.

To run linting, visual-diff, and unit tests:

```shell
npm test
```
