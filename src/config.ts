enum PageType {
  normal = "normal",
  index = "index",
  search = "search",
  create = "create",
}

enum Mode {
  normal = "normal",
  editor = "editor",
  viewer = "viewer",
}

enum ViewerType {
  marked = "marked",
  markmap = "markmap",
}

enum EditorKeymap {
  default = "default",
  vim = "vim",
}

class Config {
  _event: GoogleAppsScript.Events.AppsScriptHttpRequestEvent;

  baseUrl: string;
  page: PageType;

  fileId: string;
  fileName: string;
  fileUrl: string;
  fileLastModified: number;
  mode: string;
  editorKeymap: string;
  viewerType: string;
  sessionId: sessionId;
  error: Error;
  errorMessage: string;

  constructor(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
    this._event = e;

    this.baseUrl = ScriptApp.getService().getUrl();

    if (Object.values(PageType).includes(e.parameter["page"])) {
      this.page = e.parameter["page"];
    } else {
      this.page = PageType.normal;
    }

    this.createNewFile = !!e.parameter["createNewFile"];
    if (this.createNewFile) {
      this.page = PageType.create;
    }

    if(this.page === PageType.create) {
      return;
    }

    this.fileId = e.parameter["id"];

    if (Object.values(Mode).includes(e.parameter["mode"])) {
      this.mode = e.parameter["mode"];
    } else {
      this.mode = Mode.normal;
    }

    if (Object.values(EditorKeymap).includes(e.parameter["editorKeymap"])) {
      this.editorKeymap = e.parameter["editorKeymap"];
    } else {
      this.editorKeymap = EditorKeymap.default;
    }

    if (Object.values(ViewerType).includes(e.parameter["viewerType"])) {
      this.viewerType = e.parameter["viewerType"];
    } else {
      this.viewerType = ViewerType.marked;
    }

    // fileId が存在しない場合は Index Page として登録されたものを指定する。
    // Index Page の値は Script Property として設定する。
    if (
      this.page === PageType.normal &&
      (this.fileId == null || this.fileId === "")
    ) {
      this.page = PageType.index;
      this.fileId = getIndexPageFileId();
    }
    if (this.page === PageType.index) {
      this.mode = Mode.viewer;
      this.viewerType = ViewerType.marked;
    }

    if(this.page === PageType.index || this.page === PageType.normal) {
      try {
        const file = DriveApp.getFileById(this.fileId);
        this.fileName = file.getName();
        this.fileUrl = file.getUrl();
        this.fileLastModified = file.getLastUpdated().getTime();
      } catch(e) {
        this.error = new Error(`File not found: ${this.fileId}`);
        this.errorMessage = "指定されたIDのファイルは存在しません";
      }
    }
  }

  toJSON(): string {
    return JSON.stringify({
      baseUrl: this.baseUrl,
      page: this.page,
      fileId: this.fileId,
      fileName: this.fileName,
      fileUrl: this.fileUrl,
      fileLastModified: this.fileLastModified,
      mode: this.mode,
      editorKeymap: this.editorKeymap,
      viewerType: this.viewerType,
      sessionId: this.sessionId,
      errorMessage: this.errorMessage,
    });
  }
}

function getIndexPageFileId() {
  const scriptProps = PropertiesService.getScriptProperties();
  return scriptProps.getProperty("IndexPageFileId");
}

function setIndexPageFileId() {
  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.setProperty("IndexPageFileId", "");
}
