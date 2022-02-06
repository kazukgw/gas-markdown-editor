function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  const googleDriveFileId = e.parameter["id"];
  if (googleDriveFileId == null) {
    const fileName =
      "gas-markdown-" +
      new Date().toLocaleString().replaceAll(/\/|\ |:/g, "") +
      ".md";
    const file = DriveApp.createFile(fileName, "", "text/markdown");
    const template = HtmlService.createTemplateFromFile(
      "public/new_file_created"
    );
    template.file = file;
    template.editorUrl =
      ScriptApp.getService().getUrl() + "?id=" + file.getId();
    return setOutputOption(template.evaluate(), "Create New File");
  }
  const template = HtmlService.createTemplateFromFile("public/index");
  const file = DriveApp.getFileById(googleDriveFileId);
  const fileId = file.getId();
  const sessionId = Utilities.getUuid();
  setSessionId(fileId, sessionId);
  template.config = JSON.stringify({
    fileId: fileId,
    fileName: file.getName(),
    fileUrl: file.getUrl(),
    fileSavedAt: file.getLastUpdated().getTime(),
    mode: e.parameter["mode"] || "",
    editorKeymap: e.parameter["editorKeymap"] || "",
    viewerType: e.parameter["viewerType"] || "",
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
  const sessionId = getSessionId(id);
  if (sessionId !== currentSessionId) {
    throw new Error("別のセッションとしてファイルを保存しようとしています");
  }
  console.log("saveAsMarkdownFile: " + id);
  const file = DriveApp.getFileById(id);
  file.setContent(content);
}

function resetSessionId() {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("sessionId", "{}");
}

function setSessionId(id: string, sessId: string) {
  const userProperties = PropertiesService.getUserProperties();
  const sessionId = JSON.parse(userProperties.getProperty("sessionId") || "{}");
  sessionId[id] = sessId;
  userProperties.setProperty("sessionId", JSON.stringify(sessionId));
}

function getSessionId(id: string): string {
  const userProperties = PropertiesService.getUserProperties();
  const sessionId = JSON.parse(userProperties.getProperty("sessionId"));
  return sessionId[id];
}
