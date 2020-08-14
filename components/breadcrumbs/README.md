# Breadcrumbs

The `d2l-breadcrumbs` element can be used to help users understand where they are within an application, and provide useful clues about how the space is organized. They also provide a convenient navigation mechanism.

![screenshot of d2l-breadcrumbs component](./screenshots/basic.png)

```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="page1.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="page2.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 3" href="page3.html"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

**d2l-breadcrumbs Properties:**

| Property | Type | Description |
|--|--|--|
| `compact` | Boolean | Indicates whether the component should render in compact mode |

**d2l-breadcrumb (child) Properties:**

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text of the breadcrumb item |
| `aria-label` | String | AriaLabel of breadcrumb item |
| `href` | String | Href of the breadcrumb item |
| `target` | String | Target of the breadcrumb item |

**Accessibility:**

To make your usage of `d2l-breadcrumb` (child) accessible, use the following attribute when applicable:

| Attribute | Description |
|--|--|
| `aria-label` | Acts as a primary label. Use if `text` does not provide enough context. |

## Current Page

Based on guidance from design, sometimes the last breadcrumb represents the current page and is therefore not a link.

Use the `d2l-breadcrumb-current-page` element for this:

```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="page1.html"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="page2.html"></d2l-breadcrumb>
  <d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
</d2l-breadcrumbs>
```

## Responsive Behavior

There are various options to truncate the breadcrumb when in horizontally constrained spaces in order to keep the breadcrumb on one line.

### Limited Width

![screenshot of d2l-breadcrumbs component limited width](./screenshots/limited-width.png)

Set a `max-width` to constrain breadcrumbs to a particular width:

```html
<d2l-breadcrumbs style="max-width: 250px">
  ...
</d2l-breadcrumbs>
```

### Compact Mode

![screenshot of d2l-breadcrumbs component in compact mode](./screenshots/compact.png)

Alternately, add the `compact` attribute to only display the last breadcrumb. The `d2l-breadcrumb-current-page` will be hidden:

```html
<d2l-breadcrumbs compact>
  ...
</d2l-breadcrumbs>
```

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
