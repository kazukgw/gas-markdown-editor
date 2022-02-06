const EditorSession: Object = {
  reset: () => {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty("sessionId", "{}");
  },

  set: (id: string, sessId: string) => {
    const userProperties = PropertiesService.getUserProperties();
    const sessionId = JSON.parse(
      userProperties.getProperty("sessionId") || "{}"
    );
    sessionId[id] = sessId;
    userProperties.setProperty("sessionId", JSON.stringify(sessionId));
  },

  get: (id: string): string => {
    const userProperties = PropertiesService.getUserProperties();
    const sessionId = JSON.parse(userProperties.getProperty("sessionId"));
    return sessionId[id];
  },
};
