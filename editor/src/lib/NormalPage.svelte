<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    loadContent,
    saveAsMarkdownFile,
    changeFileName,
    createNewFile
  } from "./components/Rpc.ts";
  import {Mode, ViewerType} from "./components/Config.ts";
  import Header from "./components/Header.svelte";
  import Editor from "./components/Editor.svelte";
  import Modal from "./components/Modal.svelte";
  import ViewerMarked from "./components/ViewerMarked.svelte";
  import ViewerMarkmap from "./components/ViewerMarkmap.svelte";

  export let config;

  const content = writable("");

  let fileId = config.fileId;
  if(config.indexPageFileId) {
    fileId = config.indexPageFileId;
  }

  let editorComponent;
  let fileLastModified = config.fileLastModified;
  let modalContent;

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
      fileLastModified = new Date();
    });
  }

  function onChangeFileName(event) {
    const newFileName = event.detail
    changeFileName(config.fileId, newFileName).then(()=>{
      config.fileName = newFileName;
    })
    .catch(()=>{
      config.fileName = config.fileName;
      console.log("failed to file name changed ")
    });
  }

  function onCreateNewFileCommand(event) {
    console.log("onCreateNewFileCommand");
    const o = event.detail;
    createNewFile(o["fileName"], o["content"]).then((fileInfo)=>{
      modalContent = `
        <h2> Sucessfully file created. </h2>
        <a target="_blank" href="${fileInfo["editorUrl"]}"> ${fileInfo["editorUrl"]}</a>
        <p> Vim </p>
        <a target="_blank" href="${fileInfo["editorUrl"] + "&editorKeymap=vim"}"> ${fileInfo["editorUrl"] + "&editorKeymap=vim"}</a>
      `;
      console.log(`sucessfully file created: ${fileInfo}`);
    })
    .catch((e)=>{
      console.log("faild to create new file");
      console.log(e);
    });
  }

  onMount(()=>{
    console.log("load content");

    loadContent(fileId).then((_content)=>{
      if(editorComponent != null) {
        editorComponent.setup(_content);
      }
      content.set(_content);
    });
  })
</script>

<div id="normal-page">
  <div id="header-wrapper">
    <Header
      canFileEdit={config.mode !== Mode.viewer}
      fileName={config.fileName}
      fileUrl={config.fileUrl}
      fileLastModified={fileLastModified}
      on:changeFileName={onChangeFileName}
    />
  </div>

  <Modal content={modalContent} />

  <div id="container">
    {#if config.mode === Mode.editor}
      <Editor
        bind:this={editorComponent}
        config={config}
        on:editorChange={onEditorChange}
        on:createNewFileCommand={onCreateNewFileCommand}
      />

    {:else if config.mode === Mode.viewer}
      <svelte:component this={Viewer} content={content} mode={config.mode}/>

    {:else}
      <div class="half-column">
        <Editor
          bind:this={editorComponent}
          config={config}
          on:editorChange={onEditorChange}
          on:createNewFileCommand={onCreateNewFileCommand}
        />
      </div>

      <div class="half-column">
        <svelte:component this={Viewer} content={content} mode={config.mode}/>
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
