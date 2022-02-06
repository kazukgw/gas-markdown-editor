<script lang="ts">

  export let content;
  export let mode;

  let innerHtml = "";
  content.subscribe((value)=>{
    innerHtml = marked.parse(value || "");
  });

</script>

<div class="marked-wrapper">
  <div id="marked" class="{mode === 'viewer' ? 'marked-content-center' : ''}">
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

.marked-content-center {
  width: 50%;
  margin: auto;
}

:global(#marked) {
  font-family: Helvetica, arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
  line-height: 1.6;
  padding: 5px 30px 0 40px;
  overflow: scroll;
  background-color: white;

  :global(p), :global(ul), :global(ol) {
    color: rgb(51, 51, 50);
    margin: 0;
    margin-bottom: 6px;
    line-height: 1.5;
    letter-spacing: -0.02em;
  }

  :global(li) {
    margin-bottom: 12px;
  }

  :global(a) {
    color: inherit;
  }

  :global(h1), :global(h2) {
    font-weight: bold;
    margin-bottom: 10px;
    color: #333332;
  }

  :global(h1) {
    font-size: 30px;
  }

  :global(h2) {
    font-size: 24px;
  }

  :global(blockquote) {
    margin: 0;
    display: block;
    line-height: 1.5;
    color: #333332;
    font-style: italic;
    border-left: 3px solid gray;
    padding-left: 20px;
    margin-left: -26px;
    margin-bottom: 30px;
  }

  :global(pre) {
    font-family: Monaco,'Courier New','Courier',monospace;
    margin-bottom: 15px;
    padding: 15px;
    border: 0px;
    background-color: rgb(245, 245, 245);
  }

  :global(code) {
    background-color: rgb(245, 245, 245);
    padding: 0 4px;
  }

  :global(img) {
    display: block;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  :global(figure) {
    margin: 0;
    margin-bottom: 30px;
    position: relative;
  }

  :global(figcaption) {
    position: relative;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    color: #666665;
    font-style: italic;
    font-size: 14px;
  }

  :global(table) {
    border-collapse: collapse;
    border: 1px solid #CCC;
  }

  :global(th), :global(td) {
    padding: 5px 10px;
    border: 1px solid #CCC;
  }

  :global(th) {
    background: #EEE;
  }

  :global(hr) {
    width: 24%;
    margin: 50px auto 40px auto;
    border: 0;
    border-top: 2px solid #dededc;
  }
}
</style>


