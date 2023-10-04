# Footer
Branded footer component.

<!-- docs: demo autoSize:false -->
```html
<script type="module">
  import '@brightspace-ui/core/components/footer/footer.js';
</script>
<footer>
  <d2l-footer></d2l-footer>
</footer>
```

### Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Do use within `<footer>` tags
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use multiple times on one page
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Footer [d2l-footer]

The `d2l-footer` component adds branded D2L information to the page. It is to be used within `<footer>` tags.

<!-- docs: demo code properties name:d2l-footer autoSize:false  -->
```html
<script type="module">
  import '@brightspace-ui/core/components/footer/footer.js';
</script>

<footer>
  <d2l-footer>
  </d2l-footer>
</footer>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `color` | Boolean | Whether the footer has a background color or inherits the page's background color. Default is false, inherit page background color. |
<!-- docs: end hidden content -->
