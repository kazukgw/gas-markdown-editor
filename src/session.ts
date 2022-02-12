class EditorSession {
  static reset() {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty("sessionId", "{}");
  }

  static set(config: Config): Config {
    const sessId = Utilities.getUuid();
    const userProperties = PropertiesService.getUserProperties();
    const sessionIdMap = JSON.parse(
      userProperties.getProperty("sessionId") || "{}"
    );
    sessionIdMap[config.fileId] = sessId;
    userProperties.setProperty("sessionId", JSON.stringify(sessionIdMap));
    config.sessionId = sessId;
    return config;
  }

  static get(fileId: string): string {
    const userProperties = PropertiesService.getUserProperties();
    const sessionId = JSON.parse(userProperties.getProperty("sessionId"));
    return sessionId[fileId];
  }
}
