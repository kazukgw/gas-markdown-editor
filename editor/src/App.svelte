<script lang="ts">
  import {onMount} from 'svelte';
  import { writable } from 'svelte/store';
  import {Mode, ViewerType, Config} from "./lib/Config.ts";
  import { loadContent, saveAsMarkdownFile } from "./lib/Rpc.ts";
  import Header from "./lib/Header.svelte";
  import Editor from "./lib/Editor.svelte";
  import ViewerMarked from "./lib/ViewerMarked.svelte";
  import ViewerMarkmap from "./lib/ViewerMarkmap.svelte";


  const config = new Config(document.getElementById("config"));

  const content = writable("");

  let fileId = config.fileId;
  if(config.indexPageFileId) {
    fileId = config.indexPageFileId;
  }

  let editorComponent;
  let fileSavedAt = config.fileSavedAt;

  let Viewer;
  switch(config.viewerType) {
    case ViewerType.marked:
      Viewer = ViewerMarked;
      break;
    case ViewerType.markmap:
      Viewer = ViewerMarkmap;
      break;
  }

  function onEditorChange(event) {
    const editorValueText = event.detail;
    content.set(editorValueText);
    saveAsMarkdownFile(fileId, editorValueText, config.sessionId).then(()=>{
      fileSavedAt = new Date();
    });
  }

  onMount(()=>{
    loadContent(fileId).then((_content)=>{
      if(editorComponent != null) {
        editorComponent.setup(_content);
      }
      content.set(_content);
    });
  })
</script>

<main>
  <div id="header-wrapper">
    <Header fileName={config.fileName} fileUrl={config.fileUrl} fileSavedAt={fileSavedAt}/>
  </div>

  <div id="container">
    {#if config.mode === Mode.editor}
      <Editor
        bind:this={editorComponent}
        config={config}
        on:editorChange={onEditorChange}
      />

    {:else if config.mode === Mode.viewer}
      <svelte:component this={Viewer} content={content} mode={config.mode}/>

    {:else}
      <div class="half-column">
        <Editor
          bind:this={editorComponent}
          config={config}
          on:editorChange={onEditorChange}
        />
      </div>

      <div class="half-column">
        <svelte:component this={Viewer} content={content} mode={config.mode}/>
      </div>

    {/if}
  <div>
</main>

<style lang="scss">

:global(html),
:global(body) {
  margin: 0;
  height: 100%;
  width: 100%;
}

:global(#app) {
  width: 100%;
  height: 100%;
}

main {
  width: 100%;
  height: 100%;
}

#header-wrapper {
  height: 30px;
}

#container {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
}

.half-column {
  flex: 50%;
  height: 100%;
}
</style>
