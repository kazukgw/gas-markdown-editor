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
  template.config = JSON.stringify({
    fileId: e.parameter["id"],
    fileName: file.getName(),
    fileUrl: file.getUrl(),
    fileLastUpdated: file.getLastUpdated().getTime(),
    readOnly: e.parameter["ro"],
  });
  return setOutputOption(template.evaluate());
}

function getMarkdownTextFromfile(id: string) {
  const file = DriveApp.getFileById(id);
  return { content: file.getBlob().getDataAsString() };
}

function saveAsMarkdownFile(id: string, content: string, lastSavedAt: number) {
  console.log("saveAsMarkdownFile: " + id);
  const file = DriveApp.getFileById(id);
  const lastUpdated = file.getLastUpdated();
  if(lastUpdated.getTime() > lastSavedAt * 1) {
    throw new Error("Failed to save.")
  }
  file.setContent(content);
}
