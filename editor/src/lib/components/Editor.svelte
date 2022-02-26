<script lang="ts">
  import {onMount} from 'svelte';
  import { createEventDispatcher } from 'svelte';

  import { initCodeMirror } from './CodeMirror.ts';
  import {
    createNewFileEventPub,
    CreateNewFileEvent,
    editorChangeEventPub,
    EditorChangeEvent,
  } from "./Event.ts";
  import {Config} from "./Config.ts";


  export let config: Config;


  let codemirror;
  export function setup(content){
    codemirror.setValue(content);
  }


  const CodeMirror = window.CodeMirror;


  onMount(()=>{
    const options = { keyMap: config.editorKeymap };

    codemirror = initCodeMirror(CodeMirror, document.getElementById("editor"), options);

    codemirror.setOption("extraKeys", {
      Tab: function (cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      },
    });

    codemirror.on("change", ()=>{
      editorChangeEventPub.set(new EditorChangeEvent(codemirror.getValue()));
    });
  })

  export const focus = ()=>{
    if(codemirror != null) {
      codemirror.focus();
    }
  };

  export const getSelection = ()=>{
    if(codemirror == null) { return; }
    return codemirror.getSelection();
  };
</script>

<div id="editor-wrapper">
  <textarea id="editor"></textarea>
</div>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300&family=Noto+Sans+Mono&display=swap");

:global(.CodeMirror) {
  height: 100%;
  font-family: "Noto Sans Mono", "Noto Sans JP", monospace, sans-serif;
  font-size: 14px;
  /* background-color: rgb(39, 40, 35); */
}

#editor-wrapper {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

#editor-wrapper::-webkit-scrollbar {
  display: none;
}


</style>



