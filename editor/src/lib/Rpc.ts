const GS = window["google"]["script"];

export function loadContent(fileId: string) {
  return new Promise((res, rej) => {
    GS.run
      .withSuccessHandler((ret) => {
        console.log("read");
        res(ret["content"]);
      })
      .withFailureHandler((ret) => {
        console.log(ret);
        alert(ret);
        rej();
      })
      .getMarkdownTextFromfile(fileId);
  });
}

export const saveAsMarkdownFile = (function () {
  var interval = 10000;
  var time = Date.now(),
    lag,
    debounceTimer,
    debounceDelay = 16;

  const save = (fileId, content, sessionId, res, rej) => {
    GS.run
      .withSuccessHandler((_) => {
        console.log("save: " + fileId);
        res();
      })
      .withFailureHandler((ret) => {
        console.log(ret);
        alert(ret);
        rej();
      })
      .saveAsMarkdownFile(fileId, content, sessionId);
  };

  return function (fileId: string, content: string, sessionId: string) {
    return new Promise((res, rej) => {
      lag = time + interval - Date.now();
      if (lag < 0) {
        time = Date.now();
        save(fileId, content, sessionId, res, rej);
      } else {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          save(fileId, content, sessionId, res, rej);
        }, interval - lag + debounceDelay);
      }
    });
  };
})();
