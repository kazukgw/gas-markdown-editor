<script lang="ts">

  export let content;
  export let mode;

  let innerHtml = "";
  content.subscribe((value)=>{
    innerHtml = marked.parse(value || "");
  });

</script>

<div class="marked-wrapper">
  <div id="marked" class="markdown {mode === 'viewer' ? 'content-center' : ''}">
    {@html innerHtml}
  </div>
</div>

<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Droid+Sans:300|Roboto+Slab:300);

.marked-wrapper {
  width: 100%;
  height: 100%;
  overflow: scroll;
  overflow-wrap: break-word;
}

.content-center {
  width: 50%;
  margin: auto;
}
</style>


