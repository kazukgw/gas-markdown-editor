function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  const config = new Config(e);

  return showPageWithConfig(config)
}

function showPageWithConfig(config: Config) {
  if(config.error != null) {
    const template = HtmlService.createTemplateFromFile("public/error");
    template.errorMessage = config.errorMessage;
    return setOutputOption(template.evaluate(), "Error");
  }

  if(config.page === PageType.create) {
    return createAndShowNewFileCreatedPage();
  }

  if(config.page === PageType.normal) {
    config = EditorSession.set(config);
  }

  let title = config.fileName;
  if(config.page === PageType.search) {
    title = "Search"
  }

  const template = HtmlService.createTemplateFromFile("public/index");
  template.config = config.toJSON();
  return setOutputOption(template.evaluate(), title);
}

function getMarkdownTextFromfile(id: string) {
  const file = DriveApp.getFileById(id);
  return { content: file.getBlob().getDataAsString() };
}

function saveAsMarkdownFile(
  id: string,
  content: string,
  currentSessionId: string
) {
  const sessionId = EditorSession.get(id);
  if (sessionId !== currentSessionId) {
    throw new Error("別のセッションとしてファイルを保存しようとしています");
  }
  console.log("saveAsMarkdownFile: " + id);
  const file = DriveApp.getFileById(id);
  file.setContent(content);
}

function createAndShowNewFileCreatedPage() {
  const _t = new Date().toLocaleString().replaceAll(/\/|\ |:/g, "");
  const fileName = `gas-markdown-${_t}.md`;
  const file = DriveApp.createFile(fileName, "", "text/markdown");
  const template = HtmlService.createTemplateFromFile(
    "public/new_file_created"
  );
  template.file = file;
  template.editorUrl = ScriptApp.getService().getUrl() + "?id=" + file.getId();
  return setOutputOption(template.evaluate(), "Create New File");
}

function getRecentlyModifiedFiles(): Object[] {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1);
  const query = `mimeType = "text/markdown" and modifiedDate >="${d.toJSON().slice(0, -5)}"`;
  const fileIterator = DriveApp.searchFiles(query);
  let file: GoogleAppsScript.Drive.File;
  let count: number = 0;
  const results: Object[] = [];
  while(fileIterator.hasNext() && count < 20) {
    file = fileIterator.next();
    let folder;
    const folderIterator = file.getParents();
    if(folderIterator.hasNext()) {
      folder = folderIterator.next();
    }
    results.push({
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl(),
      lastModified: file.getLastUpdated().getTime(),
      parents: folder.getName(),
    });
    count++;
  }
  return results;
}

function searchFiles(searchValue: string): Object[] {
  const query = `mimeType = "text/markdown" and title contains '${searchValue}'`;
  const fileIterator = DriveApp.searchFiles(query);
  let file: GoogleAppsScript.Drive.File;
  let count: number = 0;
  const results: Object[] = [];
  while(fileIterator.hasNext() && count < 20) {
    file = fileIterator.next();
    let folder;
    const folderIterator = file.getParents();
    if(folderIterator.hasNext()) {
      folder = folderIterator.next();
    }
    results.push({
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl(),
      lastModified: file.getLastUpdated().getTime(),
      parents: folder.getName(),
    });
    count++;
  }
  return results;

}

function changeFileName(fileId: string, fileName: string) {
  const file = DriveApp.getFileById(fileId);
  file.setName(fileName)
}
