<script lang="ts">

  export let fileName: string;
  export let fileUrl: string;
  export let fileSavedAt: string;

</script>

<div id="header">
  <a class="title" href={fileUrl} target="_blank">
    {fileName}
  </a>
  <span class="saved-at">
    Saved at: {fileSavedAt.toLocaleString()}
  </span>
</div>

<style lang="scss">
#header {
  width: 100%;
  height: 100%;
  max-height: 30px;
  display: flex;
  justify-content: space-between;
  color: white;
  background-color: #272823;
  font-family: Helvetica, arial, sans-serif;

  span,
  a {
    display: inline-block;
    color: white;
    height: 20px;
    margin: 5px 10px;
  }
}
</style>
