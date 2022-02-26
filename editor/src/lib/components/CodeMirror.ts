export const initCodeMirror = (CodeMirror: any, textAreaElem: any, options: Object)=>{
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

  const defaultOptions = {
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
  };

  const codemirror = CodeMirror.fromTextArea(
    textAreaElem,
    Object.assign(defaultOptions, options)
  );

  return codemirror;
};

