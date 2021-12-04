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

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { codeMirror: null };
  }

  componentDidMount() {
    const self = this;
    const codeMirror = CodeMirror.fromTextArea(
      document.getElementById("editor"),
      {
        lineNumbers: true,
        mode: "text/x-markdown",
        keyMap: "vim",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "monokai",
        showTrailingSpace: true,
        styleActiveLine: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      }
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
      <div id="editor-wrapper">
        <textarea id="editor"></textarea>
      </div>
    );
  }
}

const renderMarkmap = (function () {
  var interval = 1000;
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

    this.state = { mode: "markmap", markmap: null };
  }

  previewHtml() {
    return { __html: marked.parse(this.props.content || "") };
  }

  componentDidMount() {
    const { root, features } = transformer.transform(this.props.content || "");
    const { styles, scripts } = transformer.getUsedAssets(features);

    if (styles) loadCSS(styles);
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap });
    const mm = Markmap.create("#markmap", null, root);
    this.setState({ markmap: mm });
  }

  componentDidUpdate() {
    renderMarkmap(this.state.markmap, this.props.content);
  }

  render() {
    if (this.state.mode === "markmap") {
      return <svg id="markmap" />;
    } else {
      return <div dangerouslySetInnerHTML={this.previewHtml.bind(this)()} />;
    }
  }
}

const saveAsMarkdownFile = (function () {
  var interval = 7000;
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
        .saveAsMarkdownFile(FILE_ID, content);
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
          .saveAsMarkdownFile(FILE_ID, content);
      }, interval - lag + debounceDelay);
    }
  };
})();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      savedAt: new Date(),
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
      <div id="app-container">
        <div id="header">
          <span class="title">{this.state.title}</span>
          <span class="saved-at">
            saved at: {this.state.savedAt.toLocaleString()}
          </span>
        </div>
        <Editor onChangeContent={this.changeContent.bind(this)} />
        <Preview content={this.state.content} />
      </div>
    );
  }
}

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);

console.log("rendered!");
