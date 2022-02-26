function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  return new RequestHandler(e).handle();
}

function rpc(functionName: string, args: any[]) {
  const fn: any = RPC[functionName];
  return fn.apply(this, args);
}

const RPC = {
  getMarkdownTextFromFile:(id: string) => {
    const file = DriveApp.getFileById(id);
    return { content: file.getBlob().getDataAsString() };
  },

  saveAsMarkdownFile: (
    id: string,
    content: string,
    currentSessionId: string
  ) => {
    const sessionId = EditorSession.get(id);
    if (sessionId !== currentSessionId) {
      throw new Error("別のセッションとしてファイルを保存しようとしています");
    }
    console.log("saveAsMarkdownFile: " + id);
    const file = DriveApp.getFileById(id);
    file.setContent(content);
    Drive.Files.patch({id: id, indexableText: { text: content }}, id);
  },

  getRecentlyModifiedFiles: (): Object[] => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1);
    const query = `mimeType = "text/markdown" and modifiedDate >="${d.toJSON().slice(0, -5)}"`;
    const fileIterator = DriveApp.searchFiles(query);
    let file: GoogleAppsScript.Drive.File;
    let count: number = 0;
    const results: Object[] = [];
    while(fileIterator.hasNext() && count < 20) {
      file = fileIterator.next();
      results.push({
        id: file.getId(),
        name: file.getName(),
        url: file.getUrl(),
        lastModified: file.getLastUpdated().getTime(),
      });
      count++;
    }
    return results;
  },

  searchFiles: (searchValue: string): Object[] => {
    const query = `mimeType = "text/markdown" and fullText contains "${searchValue}"`;
    const fileIterator = DriveApp.searchFiles(query);
    let file: GoogleAppsScript.Drive.File;
    let count: number = 0;
    const results: Object[] = [];
    while(fileIterator.hasNext() && count < 20) {
      file = fileIterator.next();
      results.push({
        id: file.getId(),
        name: file.getName(),
        url: file.getUrl(),
        lastModified: file.getLastUpdated().getTime(),
      });
      count++;
    }
    return results;
  },

  changeFileName: (fileId: string, fileName: string) => {
    const file = DriveApp.getFileById(fileId);
    file.setName(fileName)
  },

  createNewFile: (fileName: string, content: string) => {
    if(fileName == null || fileName === "") {
      const _t = new Date().toLocaleString().replaceAll(/\/|\ |:/g, "");
      fileName = `gas-markdown-${_t}.md`;
    }
    if(!fileName.match(/\.md$/)) {
      fileName = fileName + ".md";
    }
    const file = DriveApp.createFile(fileName, "", "text/markdown");
    if(content != null && content !== "") {
      file.setContent(content);
    }

    return {
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl(),
      editorUrl: ScriptApp.getService().getUrl() + "?id=" + file.getId(),
    };
  }
};
