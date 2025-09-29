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
| `label` | String | Label for the progress bar |
| `label-hidden` | Boolean | Hide the bar's label |
| `value-hidden` | Boolean | Hide the bar's value |
<!-- docs: end hidden content -->
