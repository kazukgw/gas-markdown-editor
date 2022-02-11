function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  if (e.parameter["createNewFile"] != null) {
    return createAndShowNewFileCreatedPage();
  }

  let fileId = e.parameter["id"];
  let mode = e.parameter["mode"] || "";
  let viewerType = e.parameter["viewerType"] || "";
  // fileId が存在しない場合は Index Page として登録されたものを指定する。
  // Index Page の値は Script Property として設定する。
  if (fileId == null) {
    fileId = getIndexPageFileId();
    mode = "viewer";
    viewerType = "marked";
  }
  let editorKeymap = e.parameter["editorKeymap"] || "";


  // 閲覧モードの場合に編集中のセッションの session ID を 上書きされると面倒なので
  // mode === viewer の場合は session id をセットしない。
  const sessionId = Utilities.getUuid();
  if(mode !== "viewer") {
    EditorSession.set(fileId, sessionId);
  }

  const template = HtmlService.createTemplateFromFile("public/index");
  const file = DriveApp.getFileById(fileId);

  template.config = JSON.stringify({
    fileId: fileId,
    fileName: file.getName(),
    fileUrl: file.getUrl(),
    fileSavedAt: file.getLastUpdated().getTime(),
    mode: mode,
    editorKeymap: editorKeymap,
    viewerType: viewerType,
    sessionId: sessionId,
  });
  return setOutputOption(template.evaluate(), file.getName());
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

function getIndexPageFileId() {
  const scriptProps = PropertiesService.getScriptProperties();
  return scriptProps.getProperty("IndexPageFileId");
}

function setIndexPageFileId() {
  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.setProperty("IndexPageFileId", "");
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
