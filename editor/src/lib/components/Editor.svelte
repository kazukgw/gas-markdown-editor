<script lang="ts">
  const CodeMirror = window.CodeMirror;

  import {onMount} from 'svelte';
  import { createEventDispatcher } from 'svelte';

  import {Config} from "./Config.ts";

  export let config: Config;

  const dispatch = createEventDispatcher();

  CodeMirror.Vim.defineAction("fold", function (cm, _ /* actionArgs */) {
    CodeMirror.commands.fold(cm);
  });
  CodeMirror.Vim.defineAction("foldAll", function (cm, _) {
    CodeMirror.commands.foldAll(cm);
  });
  CodeMirror.Vim.defineAction("unfold", function (cm, _ /* actionArgs */) {
    CodeMirror.commands.unfold(cm);
  });
  CodeMirror.Vim.defineAction("unfoldAll", function (cm, _) {
    CodeMirror.commands.unfoldAll(cm);
  });
  CodeMirror.Vim.defineEx("createNewFile", null, function (cm, params) {
    console.log(`createNewFile`);
    console.log(params);
    const args = params["args"] || [];
    const fileName = args.shift();
    let content = "";
    if(params["line"] != null && params["lineEnd"] != null){
      content = cm.getRange(
        {line: params.line, ch:0},
        {line: params.lineEnd, ch: Infinity}
      );
    }
    console.log("dispatch createNewFileCommand");
    dispatch('createNewFileCommand', {
      fileName: fileName,
      content: content,
    });
  });
  CodeMirror.Vim.mapCommand(
    "zc",
    "action",
    "fold",
    {},
    { context: "normal" }
  );
  CodeMirror.Vim.mapCommand(
    "zM",
    "action",
    "foldAll",
    {},
    { context: "normal" }
  );
  CodeMirror.Vim.mapCommand(
    "zo",
    "action",
    "unfold",
    {},
    { context: "normal" }
  );
  CodeMirror.Vim.mapCommand(
    "zR",
    "action",
    "unfoldAll",
    {},
    { context: "normal" }
  );

  const options = {
    lineWrapping: true,
    lineNumbers: true,
    mode: "text/x-markdown",
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: "monokai",
    showTrailingSpace: true,
    styleActiveLine: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    scrollbarStyle: "overlay",
    keyMap: config.editorKeymap,
  };

  let codemirror;

  onMount(()=>{
    codemirror = CodeMirror.fromTextArea(
      document.getElementById("editor"),
      options
    );
    codemirror.on("change", ()=>{
      dispatch('editorChange', codemirror.getValue());
    });

    codemirror.setOption("extraKeys", {
      Tab: function (cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      },
    });
  })

  export function setup(content){
    codemirror.setValue(content);
  }
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



