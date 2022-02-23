class RequestHandler {
  event: GoogleAppsScript.Events.AppsScriptHttpRequestEvent;
  pageType: PageType;
  page: Page;

  constructor(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
    this.event = e;
    this.pageType = this.getPageType();
    this.page = this.getPage(this.pageType);
  }

  handle(): GoogleAppsScript.HTML.HtmlOutput {
    try {
      return this.showPage();
    } catch(error) {
      const template = HtmlService.createTemplateFromFile("public/error");
      template.errorName = error.name;
      template.errorMessage = error.message;
      console.error(error);
      const output: GoogleAppsScript.HTML.HtmlOutput = template.evaluate();
      output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      output.setSandboxMode(HtmlService.SandboxMode.IFRAME);
      output.setTitle("Error");
      return output;
    }
  }

  private showPage(): GoogleAppsScript.HTML.HtmlOutput {
    return this.createHtmlPageOutput();
  }

  private createHtmlPageOutput(): GoogleAppsScript.HTML.HtmlOutput {
    const defaultConfig: DefaultConfig = createDefaultConfig(this.event, this.pageType);

    let config: Config = this.page.createPageConfig(defaultConfig);

    let template = HtmlService.createTemplateFromFile(this.page.htmlFileName);

    [template, config] = this.page.prepare(template, config);

    template.config = JSON.stringify(config);

    const output: GoogleAppsScript.HTML.HtmlOutput = template.evaluate();
    output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    output.setSandboxMode(HtmlService.SandboxMode.IFRAME);
    output.setTitle(config["object"]);

    return output;
  }

  private getPage(pageType: PageType): Page {
    const pages = {};
    pages[PageType.create] = NewFileCreatedPage;
    pages[PageType.normal] = NormalPage;
    pages[PageType.index] = IndexPage;
    pages[PageType.search] = SearchPage;

    const page = pages[pageType];
    if(page == null) {
      throw new Error(`page is not defined: ${pageType}`);
    }

    return page;
  }

  private getPageType(): PageType {
    let pageType: PageType;
    pageType = PageType[this.event.parameter["page"]];
    if(pageType == null) {
      pageType = PageType.normal;
    }

    if(pageType === PageType.normal && this.event.parameter["id"] == null) {
      pageType = PageType.index;
    }
    return pageType;
  }
}
