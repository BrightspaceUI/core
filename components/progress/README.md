# Progress Bar
Use a progress bar to show the level of completion of a system process, such as downloading, uploading, or exporting.

## Best Practices

A progress bar shows that the user's request is being processed; it gives the user tangible feedback about the status of their request, and helps them understand how long they may have to wait.

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use a progress bar for requests that may take longer than a few seconds to complete
* For long or complex processes, change the `label` to indicate key stages like "Preparing" or "Finishing up"
* Unless providing other updates to screen readers, use `announce-label` so that changes to the `label` are heard by screen reader users
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use this for requests that are usually very short, use a [loading spinner](../../components/loading-spinner/) instead
* Don't use it for scalar measurements like number of activities completed, use a [meter](../../components/meter/) instead
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Progress Bar [d2l-progress]

<!-- docs: demo code properties name:d2l-progress sandboxTitle:'Progress Bar' autoSize:false  -->
```html
<script type="module">
  import '@brightspace-ui/core/components/progress/progress.js';
</script>

<d2l-progress label="Progress" value="8" max="10"></d2l-progress>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `max` | Number | The maximum value of the progress bar |
| `value` | Number | The current value of the progress bar |
| `label` | String, required | Label for the progress bar |
| `label-hidden` | Boolean | Hide the bar's label |
| `announce-label` | Boolean | Announce the label when it changes |
| `value-hidden` | Boolean | Hide the bar's value |
<!-- docs: end hidden content -->

### Announce Label

Use the `announce-label` property to announce changes to the progress label. This can be helpful to announce steps or completion to users.

<!-- docs: demo code  -->
```html
<script type="module">
  import '@brightspace-ui/core/components/progress/progress.js';
</script>
<script>
  const button = document.querySelector('button');
  const progress = document.querySelector('d2l-progress');
  button.addEventListener('click', () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (i === 4) progress.label = 'Complete';
        else if (i >= 2) progress.label = 'Validating...';
        else progress.label = 'Uploading...';
        progress.value = i * 25;
      }, i * 1000);

    }
  });
</script>

<button>Start Animation</button>
<d2l-progress label="Uploading..." announce-label></d2l-progress>
```

## Accessibility

The progress bar aligns with web standards by using the [progress](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress) element and by assigning the `label` as the aria label.

Note that using `label-hidden` or `value-hidden` will visibly hide the label or value, but they remain available to screen reader users, and developers should make sure to provide equivalent information to sighted users.

The `announce-label` property causes changes to the `label` to be announced for screen reader users using a polite live region. Unless meaningful updates are being provided in another way, `announce-label` should be leveraged by most progress bars since some screen readers are not great at updating users about progress changes unless the user places their virtual cursor on the progress bar itself.