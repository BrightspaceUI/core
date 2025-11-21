# Progress Bar
A progress bar communicates information relating to the progress of completion of a process or workflow.

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
<!-- docs: start hidden content -->
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
<!-- docs: end hidden content -->

<button>Start Animation</button>
<d2l-progress label="Uploading..." announce-label></d2l-progress>
```
