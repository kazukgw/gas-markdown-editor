<script lang="ts">
  import { onMount } from 'svelte';

  import {
    getRecentlyModifiedFiles,
    rpcResultsPub,
    RpcFunctionType,
    RpcResults,
  } from "./Rpc.ts";
  import {
    CommandResults,
    ResultTypeError,
    ResultTypeFile,
  } from "./Command.ts"
  import Command from "./Command.svelte";
  import {
    createNewFileEventPub,
    CreateNewFileEvent,
    searchFileEventPub,
    SearchFileEvent,
    modeEventPub,
  } from "./Event.ts";

  export let config;
  export let visible = false;
  export let commandResults: CommandResults;

  let recentlyModifiedFiles = [];
  let commandComponent;

  $: if(visible) {
    if(commandComponent != null) {
      commandComponent.focus();
    }
  }

  let modalElem;
  function handleClickEvent(event) {
    if(!modalElem.contains(event.target)) {
      visible = false;
    }
  }


  rpcResultsPub.subscribe((results: RpcResults)=>{
    if(results == null) { return; }
    console.log("sub rpcresults on CommandModal");
    commandComponent.enable();

    if(results.error) {
      commandResults = new CommandResults(
        "Error.",
        [new ResultTypeError("error")]
      )
      return;
    }

    switch(results.functionName) {
      case RpcFunctionType.createNewFile:
        console.log("sucessfully create new file");
        const fileInfo = results.results;
        commandResults = new CommandResults(
          "Sucessfully file created.",
          [
            new ResultTypeFile("", fileInfo.name, "", fileInfo.editorUrl),
            new ResultTypeFile("", fileInfo.name, "keymap: vim", fileInfo.editorUrl + "&editorKeymap=vim")
          ]
        )
        commandComponent.clear();
        commandComponent.focus();
      break;

      case RpcFunctionType.searchFiles:
        console.log("sucessfully search files");
        commandResults = new CommandResults(
          "Search Results",
          results.results.map((fileInfo)=>{
            return new ResultTypeFile(
              "",
              fileInfo.name,
              `LastModified: ${new Date(fileInfo.lastModified).toLocaleString()}`,
              fileInfo.editorURl
            );
          })
        )
        commandComponent.focus();
      break;
    }
  });

  modeEventPub.subscribe((ev)=>{
    if(ev == null) { return };
    commandComponent.enable();
    commandComponent.focus();
    const setmode = (paramPairs)=>{
      const url = new URL(config.fullUrl);
      paramPairs.forEach((pair)=>{
        url.searchParams.set(pair[0], pair[1]);
      });
      return url.toString();
    };

    const vimUrl = setmode([["mode", "normal"], ["editorKeymap", "vim"]]);
    const markmapUrl = setmode([["mode", "normal"], ["viewerType", "markmap"]]);

    const vimMarkmapUrl = setmode([
      ["mode", "normal"],
      ["editorKeymap", "vim"],
      ["viewerType", "markmap"]
    ]);

    const editorUrl = setmode([["mode", "editor"]]);
    const editorVimUrl = setmode([
      ["mode", "editor"],
      ["editorKeymap", "vim"]
    ]);

    const viewerUrl = setmode([["mode", "viewer"]]);
    const viewerMarkmapUrl = setmode([
      ["mode", "viewer"],
      ["viewerType", "markmap"]
    ]);

    commandResults = new CommandResults(
      "Mode Links",
      [
        new ResultTypeFile("", config.fileName, "mode: normal, keymap: vim", vimUrl),
        new ResultTypeFile("", config.fileName, "mode: normal, viewerType: markmap", markmapUrl),
        new ResultTypeFile("", config.fileName, "mode: normal, keymap:vim, viewerType: markmap", vimMarkmapUrl),
        new ResultTypeFile("", config.fileName, "mode: editor", editorUrl),
        new ResultTypeFile("", config.fileName, "mode: editor, keymap: vim", editorVimUrl),
        new ResultTypeFile("", config.fileName, "mode: viewer", viewerUrl),
        new ResultTypeFile("", config.fileName, "mode: viewer, viewerType: markmap", viewerMarkmapUrl),
      ]
    )
  });

  onMount(async ()=>{
    const results = await getRecentlyModifiedFiles();
    recentlyModifiedFiles = results.results;
  })
</script>

<svelte:window on:click={handleClickEvent}/>

<div id="command-modal" class="{visible? '' : 'command-modal-hidden'}" bind:this={modalElem}>
  <Command
    bind:this={commandComponent}
    recentlyModifiedFiles={recentlyModifiedFiles}
    commandResults={commandResults}
    baseUrl={config.baseUrl}
  />
</div>

<style lang="scss">
#command-modal {
  --width: 50%;
  --height: 85%;
  min-height: 600px;
  z-index: 1000;
  position: absolute;
  margin: 0 0;
  overflow: scroll;
  width: var(--width);
  height: var(--height);
  top: 80px;
  left: calc(50% - var(--width) / 2);
  align-items: center;
  padding: 0px 8px;
  border: none;
  background-color: white;
  text-align: left;
  font-weight: 700;
  font-family: 'Noto Sans Mono';
  overflow-wrap: anywhere;
  box-shadow: 4px 4px 7px -5px #444;
}

.command-modal-hidden {
  visibility: hidden;
}
</style>
