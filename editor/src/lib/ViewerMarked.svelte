<script lang="ts">

  export let content;
  export let mode;

  let innerHtml = "";
  content.subscribe((value)=>{
    console.log("svelte store sbuscribe: content");
    innerHtml = marked.parse(value || "");
  });

</script>

<div class="marked-wrapper">
  <div id="marked" class="{mode === 'viewer' ? 'marked-content-center' : ''}">
    {@html innerHtml}
  </div>
</div>

<style lang="scss">

.marked-wrapper {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

#marked {
  font-family: Helvetica, arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding: 5px;
  overflow: scroll;
  background-color: white;
}

.marked-content-center {
  width: 50%;
  margin: auto;
}
</style>
