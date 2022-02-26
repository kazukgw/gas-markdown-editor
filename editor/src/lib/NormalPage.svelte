<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    getMarkdownTextFromFile,
    saveAsMarkdownFile,
    changeFileName,
    createNewFile,
    searchFiles,
  } from "./components/Rpc.ts";
  import {Mode, ViewerType} from "./components/Config.ts";
  import Header from "./components/Header.svelte";
  import Editor from "./components/Editor.svelte";
  import Modal from "./components/Modal.svelte";
  import CommandModal from "./components/CommandModal.svelte";
  import ViewerMarked from "./components/ViewerMarked.svelte";
  import ViewerMarkmap from "./components/ViewerMarkmap.svelte";
  import {
    editorChangeEventPub,
    EditorChangeEvent,
    changeFileNameEventPub,
    ChangeFileNameEvent,
    createNewFileEventPub,
    searchFileEventPub,
  } from "./components/Event.ts";

  export let config;

  const content = writable("");
  let fileId = config.fileId;
  let fileLastModified = config.fileLastModified;
  let editorComponent;
  let commandModalVisible;
  let viewerComponent;

  function init() {
    switch(config.viewerType) {
      case ViewerType.marked:
        viewerComponent = ViewerMarked;
        break;
      case ViewerType.markmap:
        viewerComponent = ViewerMarkmap;
        break;
    }
  }

  editorChangeEventPub.subscribe((ev: EditorChangeEvent)=>{
    if(ev == null) { return; }
    console.log("sub editorChangeEvent on NormalPage");
    content.set(ev.value);
    saveAsMarkdownFile(fileId, ev.value, config.sessionId).then(()=>{
      fileLastModified = new Date();
    });
  });

  changeFileNameEventPub.subscribe((ev: ChangeFileNameEvent)=> {
    if(ev == null) { return; }
    console.log("sub changefileNameEvent on NormalPage");
    changeFileName(config.fileId, ev.fileName).then(()=>{
      config.fileName = ev.fileName;
    })
    .catch(()=>{
      config.fileName = config.fileName;
      console.log("failed to file name changed ")
    });
  });

  createNewFileEventPub.subscribe((ev: CreateNewFileEvent) => {
    if(ev == null) { return; }
    console.log("sub CreateNewFileEvent");
    let content = editorComponent.getSelection();
    createNewFile(ev.fileName, content);
  });

  searchFileEventPub.subscribe((ev: SearchFileEvent)=>{
    if(ev == null) { return; }
    console.log("sub SearchFileEvent");
    searchFiles(ev.value);
  });

  function handleKeydownEvent(event) {
    if(event["ctrlKey"] && event.keyCode === 222) {
      commandModalVisible = !commandModalVisible;
    }
  }

  $: if(!commandModalVisible) {
    if(editorComponent != null) {
      editorComponent.focus();
    }
  }

  onMount(()=>{
    getMarkdownTextFromFile(fileId).then((results)=>{
      console.log("get initial markdown text");
      console.log(results);
      if(editorComponent != null) {
        editorComponent.setup(results.results.content);
      }
      content.set(results.results.content);
    });
  })

  init();
</script>

<svelte:window on:keydown={handleKeydownEvent}/>

<div id="normal-page">
  <div id="header-wrapper">
    <Header
      canFileEdit={config.mode !== Mode.viewer}
      fileName={config.fileName}
      fileUrl={config.fileUrl}
      fileLastModified={fileLastModified}
    />
  </div>

  <CommandModal bind:visible={commandModalVisible} config={config} />

  <div id="container">
    {#if config.mode === Mode.editor}
      <Editor
        bind:this={editorComponent}
        config={config}
      />

    {:else if config.mode === Mode.viewer}
      <svelte:component this={viewerComponent} content={content} mode={config.mode}/>

    {:else}
      <div class="half-column">
        <Editor
          bind:this={editorComponent}
          config={config}
        />
      </div>

      <div class="half-column">
        <svelte:component this={viewerComponent} content={content} mode={config.mode}/>
      </div>

    {/if}
  </div>
</div>

<style lang="scss">

#normal-page {
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
  width: 50%;
  height: 100%;
}
</style>
