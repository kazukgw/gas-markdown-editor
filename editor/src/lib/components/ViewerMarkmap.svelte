<script lang="ts">
  import {onMount} from 'svelte';
  import { Transformer } from "markmap-lib";

  export let content;
  export let mode;

  const transformer = new Transformer();
  const { markmap } = window;
  const { Markmap, loadCSS, loadJS } = markmap;

  let mm;

  onMount(()=>{

    const { root, features } = transformer.transform("");
    const { styles, scripts } = transformer.getUsedAssets(features);

    if (styles) loadCSS(styles);
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap });
    mm = Markmap.create("#markmap", null, root);
  });

  const renderMarkmap = (function () {
    var interval = 2000;
    var time = Date.now(),
      lag,
      debounceTimer,
      debounceDelay = 16;

    return function (markmap, content) {
      lag = time + interval - Date.now();
      if (lag < 0) {
        const { root } = transformer.transform(content || "");
        markmap.setData(root);
        time = Date.now();
      } else {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          const { root } = transformer.transform(content || "");
          markmap.setData(root);
        }, interval - lag + debounceDelay);
      }
    };
  })();

  content.subscribe((value)=>{
    if(mm == null) {
      return;
    }
    renderMarkmap(mm, value);
  });
</script>

<svg id="markmap"></svg>

<style lang="scss">
#markmap {
  width: 100%;
  height: 100%;
  background-color: white;
  /* flex: 1; */
}
</style>
