function setOutputOption(
  output: GoogleAppsScript.HTML.HtmlOutput
): GoogleAppsScript.HTML.HtmlOutput {
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  output.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  output.setTitle(this.title);
  return output;
}

function includeHtml(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
