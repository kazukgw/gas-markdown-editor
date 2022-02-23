class EditorSession {
  static reset() {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty("sessionId", "{}");
  }

  static set(fileId: string): string {
    const sessId = Utilities.getUuid();
    const userProperties = PropertiesService.getUserProperties();
    const sessionIdMap = JSON.parse(
      userProperties.getProperty("sessionId") || "{}"
    );
    sessionIdMap[fileId] = sessId;
    userProperties.setProperty("sessionId", JSON.stringify(sessionIdMap));
    return sessId;
  }

  static get(fileId: string): string {
    const userProperties = PropertiesService.getUserProperties();
    const sessionId = JSON.parse(userProperties.getProperty("sessionId"));
    return sessionId[fileId];
  }
}
