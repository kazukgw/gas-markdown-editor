export enum Mode {
  normal = "normal",
  editor = "editor",
  viewer = "viewer",
}

export enum ViewerType {
  marked = "marked",
  markmap = "markmap",
}

export enum EditorKeymap {
  default = "default",
  vim = "vim",
}

export enum PageType {
  normal = "normal",
  index = "index",
  search = "search",
  create = "create",
}

export class Config {
  data: Object;
  baseUrl: string;
  page: PageType;
  mode: Mode;
  viewerType: ViewerType;
  editorKeymap: string;
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileLastModified: Date;
  sessionId: number;

  constructor(elem: HTMLElement) {
    this.data = JSON.parse(elem.innerText);

    console.log(this.data);

    this.baseUrl = this.data["baseUrl"];
    this.mode = this.data["mode"];
    this.page = this.data["page"];
    this.viewerType = this.data["viewerType"];
    this.editorKeymap = this.data["editorKeymap"];
    this.fileId = this.data["fileId"];
    this.fileName = this.data["fileName"];
    this.fileUrl = this.data["fileUrl"];
    this.fileLastModified = new Date(this.data["fileLastModified"]);
    this.sessionId = this.data["sessionId"];
  }
}
