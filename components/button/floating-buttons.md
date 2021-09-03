# Floating Buttons

Floating workflow buttons behavior can be added by using the `<d2l-floating-buttons>` custom element. When the normal position of the workflow buttons is below the bottom edge of the viewport, they will dock at the bottom edge. When the normal position becomes visible, they will undock.

<!-- docs: demo name:d2l-floating-buttons autoSize:false display:block size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/floating-buttons.js';
  import '@brightspace-ui/core/components/button/button.js';
</script>
<style>
  .d2l-typography p {
    margin: 1rem;
  }
  d2l-button { 
    margin-left: 0.5rem;
  }
</style>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt. Numquam voluptate, velit quisquam ipsa molestias laudantium odit reiciendis nisi corporis voluptatibus, voluptatum sunt natus, accusantium magnam consequatur fugit officiis minima voluptatem consequuntur nam, earum necessitatibus! Cupiditate ullam repellendus, eius iure voluptas at commodi consectetur, quia, adipisci possimus, ex mollitia. Labore harum error consectetur officiis aut optio, temporibus iste nobis ducimus cumque laudantium rem pariatur. Ut repudiandae id, consequuntur quasi quis pariatur autem corporis perferendis facilis eius similique voluptatibus iusto deleniti odio officia numquam tenetur excepturi, aspernatur sunt minima aut fugiat ipsam.
</p>
<d2l-floating-buttons min-height="100px">
  <d2l-button primary>Primary</d2l-button>
  <d2l-button>Secondary</d2l-button>
</d2l-floating-buttons>
```

<!-- docs: start hidden content -->
![Floating Buttons](./screenshots/floating-buttons.png?raw=true)
<!-- docs: end hidden content -->

## Floating button [d2l-floatin-button]

<!-- docs: demo live name:d2l-floating-buttons autoSize:false display:block size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/floating-buttons.js';
  import '@brightspace-ui/core/components/button/button.js';
</script>
<style>
  .d2l-typography p {
    margin: 1rem;
  }

  d2l-button { 
    margin-left: 0.5rem;
  }
</style>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt. Numquam voluptate, velit quisquam ipsa molestias laudantium odit reiciendis nisi corporis voluptatibus, voluptatum sunt natus, accusantium magnam consequatur fugit officiis minima voluptatem consequuntur nam, earum necessitatibus! Cupiditate ullam repellendus, eius iure voluptas at commodi consectetur, quia, adipisci possimus, ex mollitia. Labore harum error consectetur officiis aut optio, temporibus iste nobis ducimus cumque laudantium rem pariatur. Ut repudiandae id, consequuntur quasi quis pariatur autem corporis perferendis facilis eius similique voluptatibus iusto deleniti odio officia numquam tenetur excepturi, aspernatur sunt minima aut fugiat ipsam. Ea nesciunt, amet fugit facere similique dolor nam tempora perferendis aut fugiat non, ex pariatur excepturi odio aspernatur libero saepe ducimus rem magni cumque. Laboriosam nisi fuga accusantium quos qui? Maiores ratione aliquam eos odio eius molestiae nesciunt exercitationem dolor perspiciatis quam. Necessitatibus rem nihil ad culpa, tenetur iusto consectetur rerum, delectus neque? Error, quas, eaque! Quibusdam voluptas expedita possimus consequatur accusantium distinctio, esse quisquam, ipsa blanditiis, officia perferendis et? Iste, nam optio vero earum tenetur voluptatibus modi a, odit aliquid eos corporis nulla saepe vel neque voluptate ratione, facilis quo sed nisi voluptates nostrum dolor. Non mollitia dignissimos laudantium quos libero nisi, nobis harum, asperiores soluta reprehenderit doloremque ipsa id unde voluptates beatae deserunt. Minima repellendus ipsam molestias veritatis pariatur nobis nihil, alias quasi, esse, aspernatur saepe beatae, hic consequatur. Sit sequi, libero quisquam quibusdam fuga tempore ab molestiae praesentium, necessitatibus, vero odio ullam qui non totam voluptas reprehenderit ad neque voluptate. Nam atque impedit ducimus, dolore reiciendis delectus inventore beatae cumque. Magni, id quos officiis soluta consequatur nam quis, modi fugit adipisci vel autem dolorum iusto cumque, libero reprehenderit amet doloremque voluptatem sunt sapiente reiciendis omnis, similique nulla enim. Autem repellendus, illo eveniet recusandae quae quibusdam itaque, delectus, consequatur provident vitae vero magnam repudiandae fugit, placeat sapiente! Omnis, possimus natus.
</p>
<d2l-floating-buttons min-height="100px">
  <d2l-button primary>Primary</d2l-button>
  <d2l-button>Secondary</d2l-button>
</d2l-floating-buttons>
```

<!-- docs: start hidden content -->
### Properties:

| Property | Type | Description |
|--|--|--|
| `always-float` | Boolean | Indicates to display buttons as always floating |
| `min-height` | String, default: `'500px'` | The minimum height of the viewport to display floating buttons at (where applicable). If viewport is less than `min-height`, buttons will never appear floating (unless `always-float` is used). If viewport is greater than `min-height` then buttons will float when applicable. |
<!-- docs: end hidden content -->
