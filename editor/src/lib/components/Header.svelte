<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let canFileEdit: boolean = false;
  export let fileName: string;
  export let fileUrl: string;
  export let vimUrl: string;
  export let fileLastModified: string;

  let fileNameEditting = false;
  let newFileName = fileName;

  const dispatch = createEventDispatcher();
  function changeFileName() {
    fileNameEditting = true;
  }

</script>

<div id="header">
  <div class="file-name-wrapper">
    <a href={fileUrl} target="_blank">
      <i class="fas fa-info-circle"></i>
    </a>
    {#if canFileEdit && fileNameEditting}
      <input
        autofocus
        class="file-name"
        type="text"
        bind:value={newFileName}
        on:change={()=>{
          if(newFileName === "") {
            newFileName = fileName;
            return;
          }
          fileNameEditting = false;
          fileName = newFileName;
          dispatch('changeFileName', newFileName);
        }}
        on:focusout={()=>{fileNameEditting = false}}
      />
    {:else}
      <span class="file-name" on:click={changeFileName}>
        {fileName}
      </span>
    {/if}
  </div>
  <span class="last-modified">
    Last modified: {fileLastModified.toLocaleString()}
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
    margin: 5px 5px;
  }

  .file-name-wrapper {
    margin-left: 5px;
  }

  input[type="text"] {
    width: 300px;
  }

  input[type="text"]:focus {
    outline: none;
  }
}
</style>
