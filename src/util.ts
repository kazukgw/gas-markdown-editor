function setOutputOption(
  output: GoogleAppsScript.HTML.HtmlOutput,
  title: string
): GoogleAppsScript.HTML.HtmlOutput {
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  output.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  output.setTitle(title);
  return output;
}

function includeHtml(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
