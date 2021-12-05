function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  const googleDriveFileId = e.parameter["id"];
  if(googleDriveFileId == null) {
    const fileName = "gas-markdown-" + (new Date().toLocaleString()).replaceAll(/\/|\ |:/g, "")  + ".md";
    const file = DriveApp.createFile(fileName, "", "text/markdown");
    const template = HtmlService.createTemplateFromFile("_new_file_created");
    template.file = file;
    template.editorUrl = ScriptApp.getService().getUrl() + "?id=" + file.getId();
    return setOutputOption(template.evaluate());
  }
  const template = HtmlService.createTemplateFromFile("_index");
  const file = DriveApp.getFileById(googleDriveFileId);
  template.config = JSON.stringify({
    fileId: e.parameter["id"],
    fileName: file.getName(),
    fileUrl: file.getUrl(),
    readOnly: e.parameter["ro"],
  })
  return setOutputOption(template.evaluate());
}

function redirect() {

}

function getMarkdownTextFromfile(id: string) {
  const file = DriveApp.getFileById(id);
  return { content:  file.getBlob().getDataAsString()};
}

function saveAsMarkdownFile(id: string, content: string) {
  console.log("saveAsMarkdownFile: " + id);
  console.log("content: " + content);
  const file = DriveApp.getFileById(id);
  file.setContent(content);
}
