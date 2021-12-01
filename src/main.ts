function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  const template = HtmlService.createTemplateFromFile("_index");
  let googleDriveFileId = e.parameter["id"];
  if(googleDriveFileId == null) {
    const fileName = "gas-markdown-" + (new Date().toLocaleString()).replaceAll(/\/|\ |:/g, "")  + ".md";
    const file = DriveApp.createFile(fileName, "", "text/markdown");
    googleDriveFileId = file.getId();
  }
  template.googleDriveFileId = JSON.stringify({googleDriveFileId: e.parameter["id"]})
  return setOutputOption(template.evaluate());
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
