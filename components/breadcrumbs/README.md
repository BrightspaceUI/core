# Breadcrumbs

The `d2l-breadcrumbs` element can be used to help users understand where they are within an application, and provide useful clues about how the space is organized. They also provide a convenient navigation mechanism.

<!-- docs: start hidden content -->
![screenshot of d2l-breadcrumbs component](./screenshots/basic.png)
<!-- docs: end hidden content -->

<!-- docs: demo -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="page1.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="page2.html"></d2l-breadcrumb>
  <d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
</d2l-breadcrumbs>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Breadcrumbs should be used to show the information architecture of a page, not the history
* Breadcrumbs are page level controls – only one should appear on a page a time. If a page that normally has breadcrumbs is embedded in another page, remove the breadcrumbs from the embedded page.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Do not use breadcrumbs for multi-step processes, use a Stepper (TBD)
* If your navigation is only one level deep, and never gets deeper than one level, consider other design patterns or components
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Responsive Behavior

There are various options to truncate the breadcrumb when in horizontally constrained spaces in order to keep the breadcrumb on one line.

### Limited Width

<!-- docs: start hidden content -->
![screenshot of d2l-breadcrumbs component limited width](./screenshots/limited-width.png)
<!-- docs: end hidden content -->

Set a `max-width` to constrain breadcrumbs to a particular width:

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs style="max-width: 250px">
  <d2l-breadcrumb text="Trucate Basic Item 1" href="page1.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Truncate Basic Item 2" href="page2.html"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

### Compact Mode

<!-- docs: start hidden content -->
![screenshot of d2l-breadcrumbs component in compact mode](./screenshots/compact.png)
<!-- docs: end hidden content -->

Alternately, add the `compact` attribute to only display the last breadcrumb. The `d2l-breadcrumb-current-page` will be hidden:

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs compact>
  <d2l-breadcrumb text="Item 1" href="page1.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="page2.html"></d2l-breadcrumb>
  <d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
</d2l-breadcrumbs>
```

## Breadcrumbs [d2l-breadcrumbs]

<!-- docs: demo live name:d2l-breadcrumbs -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="page1.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="page2.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 3" href="page3.html"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `compact` | Boolean | Indicates whether the component should render in compact mode |
<!-- docs: end hidden content -->

## Breadcrumb (child) [d2l-breadcrumb]

<!-- docs: demo live name:d2l-breadcrumb -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="page1.html"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text of the breadcrumb item |
| `aria-label` | String | AriaLabel of breadcrumb item |
| `href` | String | Href of the breadcrumb item |
| `target` | String | Target of the breadcrumb item |
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-breadcrumb` (child) accessible, use the following attribute when applicable:

| Attribute | Description |
|--|--|
| `aria-label` | Acts as a primary label. Use if `text` does not provide enough context. |

## Current Page [d2l-breadcrumb-current-page]

Based on guidance from design, sometimes the last breadcrumb represents the current page and is therefore not a link.

Use the `d2l-breadcrumb-current-page` element for this:

<!-- docs: demo live name:d2l-breadcrumb-current-page -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="page1.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="page2.html"></d2l-breadcrumb>
  <d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
</d2l-breadcrumbs>
```
