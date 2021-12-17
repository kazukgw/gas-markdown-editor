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
    return setOutputOption(template.evaluate());
  }
  const template = HtmlService.createTemplateFromFile("public/index");
  const file = DriveApp.getFileById(googleDriveFileId);
  const sessionId = Utilities.getUuid();
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("sessionId", sessionId);
  template.config = JSON.stringify({
    fileId: e.parameter["id"],
    fileName: file.getName(),
    fileUrl: file.getUrl(),
    fileLastUpdated: file.getLastUpdated().getTime(),
    readOnly: e.parameter["ro"],
    editorKeyMap: e.parameter["editorKeyMap"],
    viewer: e.parameter["viewer"],
    sessionId: sessionId,
  });
  return setOutputOption(template.evaluate());
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
  const userProperties = PropertiesService.getUserProperties();
  const sessionId = userProperties.getProperty("sessionId");
  if (sessionId !== currentSessionId) {
    throw new Error("別のセッションとしてファイルを保存しようとしています");
  }
  console.log("saveAsMarkdownFile: " + id);
  const file = DriveApp.getFileById(id);
  file.setContent(content);
}
