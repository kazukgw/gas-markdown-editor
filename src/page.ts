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

interface Config {
  fullUrl: string;
  baseUrl: string;
  page: PageType;
  title: string;
}

interface DefaultConfig extends Config {
  fileId?: string;
  mode: Mode;
  editorKeymap: EditorKeymap;
  viewerType: ViewerType;
}

interface NewFileCreatedPageConfig extends DefaultConfig {

}

interface IndexPageConfig extends DefaultConfig{
  fileName: string;
  fileUrl: string;
  fileLastModified: number;
}

interface NormalPageConfig extends IndexPageConfig {
  sessionId: string;
}

interface SearchPageConfig extends DefaultConfig{}


function createDefaultConfig(
  event: GoogleAppsScript.Events.AppsScriptHttpRequestEvent,
  pageType: PageType
): DefaultConfig {
  const requestParams = event.parameter;
  const config = {} as DefaultConfig;

  config.page = pageType;

  config.baseUrl = ScriptApp.getService().getUrl();
  config.fullUrl = config.baseUrl + "?" + event.queryString;

  config.fileId = requestParams["id"];

  config.mode = Mode[requestParams["mode"]];
  if(config.mode == null) {
    config.mode = Mode.normal;
  }

  config.editorKeymap = EditorKeymap[requestParams["editorKeymap"]];
  if(config.editorKeymap == null) {
    config.editorKeymap = EditorKeymap.default;
  }

  config.viewerType = ViewerType[requestParams["viewerType"]];
  if(config.viewerType == null) {
    config.viewerType = ViewerType.marked;
  }

  return config;
}

interface Page {
  type: PageType;
  htmlFileName: string;
  createPageConfig: (config: DefaultConfig) => Config;
  prepare: (
    template: GoogleAppsScript.HTML.HtmlTemplate,
    config: Config
  ) => [GoogleAppsScript.HTML.HtmlTemplate, Config];
}

const NewFileCreatedPage: Page = {
  type: PageType.create,
  htmlFileName: "public/new_file_created",
  createPageConfig: (cnf: DefaultConfig): Config => {
    const config = cnf as NewFileCreatedPageConfig;
    config.title = "New File Created";
    return config;
  },
  prepare: (
    template: GoogleAppsScript.HTML.HtmlTemplate,
    config: Config
  ): [GoogleAppsScript.HTML.HtmlTemplate, Config] => {
    const _t = new Date().toLocaleString().replaceAll(/\/|\ |:/g, "");
    const fileName = `gas-markdown-${_t}.md`;
    const file = DriveApp.createFile(fileName, "", "text/markdown");
    template.file = file;
    template.editorUrl = ScriptApp.getService().getUrl() + "?id=" + file.getId();
    return [template, config];
  },
};

const NormalPage: Page = {
  type: PageType.normal,
  htmlFileName: "public/index",
  createPageConfig: (cnf: DefaultConfig): Config => {
    const config = cnf as NormalPageConfig;

    const file = DriveApp.getFileById(config.fileId);
    config.fileName = file.getName();
    config.fileUrl = file.getUrl();
    config.fileLastModified = file.getLastUpdated().getTime();
    config.title = config.fileName;

    config.sessionId = EditorSession.set(file.getId());

    return config;
  },
  prepare: (
    template: GoogleAppsScript.HTML.HtmlTemplate,
    config: Config
  ): [GoogleAppsScript.HTML.HtmlTemplate, Config] => { return [template, config] },
};

const IndexPage: Page = {
  type: PageType.index,
  htmlFileName: "public/index",
  createPageConfig: (cnf: DefaultConfig): Config => {
    const config = cnf as IndexPageConfig;

    config.page = PageType.index;

    const scriptProps = PropertiesService.getScriptProperties();
    config.fileId = scriptProps.getProperty("IndexPageFileId");

    const file = DriveApp.getFileById(config.fileId);
    config.fileName = file.getName();
    config.fileUrl = file.getUrl();
    config.fileLastModified = file.getLastUpdated().getTime();
    config.title = config.fileName;

    config.mode = Mode.viewer;
    config.viewerType = ViewerType.marked;

    return config;
  },
  prepare: (
    template: GoogleAppsScript.HTML.HtmlTemplate,
    config: Config
  ): [GoogleAppsScript.HTML.HtmlTemplate, Config] => { return [template, config] },
};

const SearchPage: Page = {
  type: PageType.search,
  htmlFileName: "public/index",
  createPageConfig: (cnf: DefaultConfig): Config => {
    const config = cnf as SearchPageConfig;
    config.title = "Search";
    return config;
  },
  prepare: (
    template: GoogleAppsScript.HTML.HtmlTemplate,
    config: Config
  ): [GoogleAppsScript.HTML.HtmlTemplate, Config] => { return [template, config] },
};

