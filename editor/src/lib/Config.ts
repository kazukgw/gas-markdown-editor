export enum Mode {
  normal = "normal",
  editor = "editor",
  viewer = "viewer",
}

export enum ViewerType {
  marked = "marked",
  markmap = "markmap",
}

export class Config {
  data: Object;
  mode: Mode;
  viewerType: ViewerType;
  editorKeymap: string;
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSavedAt: Date;
  sessionId: number;

  constructor(elem: HTMLElement) {
    this.data = JSON.parse(elem.innerText);

    console.log(this.data);

    const _mode = this.data["mode"].toLowerCase();
    if (
      _mode !== Mode.normal &&
      _mode !== Mode.editor &&
      _mode !== Mode.viewer
    ) {
      this.mode = Mode.normal;
    } else {
      this.mode = _mode;
    }

    const _viewerType = this.data["viewerType"].toLowerCase();
    if (
      _viewerType !== ViewerType.marked &&
      _viewerType !== ViewerType.markmap
    ) {
      this.viewerType = ViewerType.marked;
    } else {
      this.viewerType = _viewerType;
    }

    const _editorKeymap = this.data["editorKeymap"].toLowerCase();
    if (_editorKeymap === "vim") {
      this.editorKeymap = "vim";
    } else {
      // NOTE: https://codemirror.net/doc/manual.html#keymaps
      this.editorKeymap = "default";
    }

    this.fileId = this.data["fileId"];
    this.fileName = this.data["fileName"];
    this.fileUrl = this.data["fileUrl"];
    this.fileSavedAt = new Date(this.data["fileSavedAt"]);
    this.sessionId = this.data["sessionId"];
  }
}
