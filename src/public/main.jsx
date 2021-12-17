console.log("start");

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Transformer } from "markmap-lib";

const transformer = new Transformer();

const { markmap } = window;
const { Markmap, loadCSS, loadJS } = markmap;

const GS = google.script;
const CONFIG = JSON.parse(document.getElementById("config").textContent);
const FILE_ID = CONFIG["fileId"];
const FILE_NAME = CONFIG["fileName"];
const FILE_URL = CONFIG["fileUrl"];
const READ_ONLY = CONFIG["readOnly"] === "true";
const FILE_LAST_SAVED_AT = CONFIG["fileLastUpdated"];
const SESSION_ID = CONFIG["sessionId"];

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { codeMirror: null };
  }

  componentDidMount() {
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
    };

    if (CONFIG["editorKeyMap"] === "vim") {
      options["keyMap"] = "vim";
    }

    const codeMirror = CodeMirror.fromTextArea(
      document.getElementById("editor"),
      options
    );
    codeMirror.on("change", this.handleCodeMirrorChange.bind(this));
    this.setState({ codeMirror: codeMirror });

    GS.run
      .withSuccessHandler((ret) => {
        console.log("read");
        codeMirror.setOption("extraKeys", {
          Tab: function (cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
          },
        });
        codeMirror.setValue(ret["content"]);
      })
      .withFailureHandler((ret) => {
        console.log(ret);
        alert(ret);
      })
      .getMarkdownTextFromfile(FILE_ID);
  }

  handleCodeMirrorChange() {
    console.log(this.props);
    this.props.onChangeContent(this.state.codeMirror.getValue());
  }

  render() {
    return (
      <div id="editor-wrapper" class={READ_ONLY ? "hidden" : ""}>
        <textarea id="editor"></textarea>
      </div>
    );
  }
}

const renderMarkmap = (function () {
  var interval = 2000;
  var time = Date.now(),
    lag,
    debounceTimer,
    debounceDelay = 16;

  return function (markmap, content) {
    lag = time + interval - Date.now();
    if (lag < 0) {
      //console.log( time + "：throttle：" + lag);
      const { root } = transformer.transform(content || "");
      markmap.setData(root);
      time = Date.now();
    } else {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        //console.log( time + "：debounce：" + (interval - lag + debounceDelay));
        const { root } = transformer.transform(content || "");
        markmap.setData(root);
      }, interval - lag + debounceDelay);
    }
  };
})();

class Preview extends React.Component {
  constructor(props) {
    super(props);

    this.state = { markmap: null };
    this.state["mode"] = CONFIG["viewer"] === "markmap" ? "markmap" : "";
  }

  previewHtml() {
    return { __html: marked.parse(this.props.content || "") };
  }

  componentDidMount() {
    if(this.state.mode === "markmap") {
      const { root, features } = transformer.transform(this.props.content || "");
      const { styles, scripts } = transformer.getUsedAssets(features);

      if (styles) loadCSS(styles);
      if (scripts) loadJS(scripts, { getMarkmap: () => markmap });
      const mm = Markmap.create("#markmap", null, root);
      this.setState({ markmap: mm });
    }
  }

  componentDidUpdate() {
    if(this.state.mode === "markmap") {
      renderMarkmap(this.state.markmap, this.props.content);
    }
  }

  render() {
    if (this.state.mode === "markmap") {
      return <svg id="markmap" />;
    } else {
      return <div id="marked" class="markdown-body" dangerouslySetInnerHTML={this.previewHtml.bind(this)()} />;
    }
  }
}

const saveAsMarkdownFile = (function () {
  var interval = 10000;
  var time = Date.now(),
    lag,
    debounceTimer,
    debounceDelay = 16;

  return function (content, callback) {
    lag = time + interval - Date.now();
    if (lag < 0) {
      //console.log( time + "：throttle：" + lag);
      GS.run
        .withSuccessHandler((_) => {
          console.log("save: " + FILE_ID);
          callback();
        })
        .withFailureHandler((ret) => {
          console.log(ret);
          alert(ret);
        })
        .saveAsMarkdownFile(FILE_ID, content, SESSION_ID);
      time = Date.now();
    } else {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        //console.log( time + "：debounce：" + (interval - lag + debounceDelay));
        GS.run
          .withSuccessHandler((_) => {
            console.log("save: " + FILE_ID);
            callback();
          })
          .withFailureHandler((ret) => {
            console.log(ret);
            alert(ret);
          })
          .saveAsMarkdownFile(FILE_ID, content, SESSION_ID);
      }, interval - lag + debounceDelay);
    }
  };
})();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      savedAt: FILE_LAST_SAVED_AT,
      content: "",
      title: FILE_NAME,
    };
  }

  changeContent(content) {
    this.setState({ content: content });
    this.saveAsMarkdownFile(content);
  }

  saveAsMarkdownFile(content) {
    const self = this;
    saveAsMarkdownFile(content, () => {
      self.setState({ savedAt: new Date() });
    });
  }

  render() {
    return (
      <>
        <div id="header">
          <a class="title" href={FILE_URL} target="_blank">
            {this.state.title}
          </a>
          <span class="saved-at">
            Last saved at: {this.state.savedAt.toLocaleString()}
          </span>
        </div>
        <div id="app-container">
          <Editor onChangeContent={this.changeContent.bind(this)} />
          <Preview content={this.state.content} />
        </div>
      </>
    );
  }
}

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);

console.log("rendered!");
