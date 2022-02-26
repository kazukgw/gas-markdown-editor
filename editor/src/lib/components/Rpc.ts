import { writable } from "svelte/store";

const GS = window["google"]["script"];

export class RpcResults {
  functionName: RpcFunctionType;
  results: any;
  error: boolean;

  constructor(functionName: RpcFunctionType, results: any, error: boolean) {
    this.functionName = functionName;
    this.results = results;
    this.error = error;
  }
}

export enum RpcFunctionType {
  createNewFile = "createNewFile",
  changeFileName = "changeFileName",
  searchFiles = "searchFiles",
  getRecentlyModifiedFiles = "getRecentlyModifiedFiles",
  getMarkdownTextFromFile = "getMarkdownTextFromFile",
  saveAsMarkdownFile = "saveAsMarkdownFile",
};

export const rpcResultsPub = writable(null);

function rpc(functionName: RpcFunctionType, args: any[]) {
  return new Promise((res, rej) => {
    GS.run
      .withSuccessHandler((ret) => {
        const results = new RpcResults(functionName, ret, false);
        rpcResultsPub.set(results);
        res(results);
      })
      .withFailureHandler((ret) => {
        const results = new RpcResults(functionName, ret, true);
        console.log(results);
        rpcResultsPub.set(results);
        rej();
      })
      .rpc(functionName, args);
  });
}

export function createNewFile(fileName: string, content: string) {
  return rpc(RpcFunctionType.createNewFile,[fileName, content]);
}

export function changeFileName(fileId: string, fileName: string) {
  return rpc(RpcFunctionType.changeFileName,[fileId, fileName]);
}

export function searchFiles(searchValue: string) {
  return rpc(RpcFunctionType.searchFiles, [searchValue]);
}

export function getRecentlyModifiedFiles() {
  return rpc(RpcFunctionType.getRecentlyModifiedFiles, []);
}

export function getMarkdownTextFromFile(fileId: string) {
  return rpc(RpcFunctionType.getMarkdownTextFromFile, [fileId]);
}

export const saveAsMarkdownFile = (function () {
  var interval = 10000;
  var time = Date.now(),
    lag,
    debounceTimer,
    debounceDelay = 16;

  const save = (fileId, content, sessionId, res, rej) => {
    GS.run
      .withSuccessHandler((ret) => {
        console.log("save: " + fileId);
        rpcResultsPub.set(new RpcResults(RpcFunctionType.saveAsMarkdownFile, ret, false));
        res();
      })
      .withFailureHandler((ret) => {
        console.log(ret);
        rpcResultsPub.set(new RpcResults(RpcFunctionType.saveAsMarkdownFile, ret, true));
        rej();
      })
      .rpc(RpcFunctionType.saveAsMarkdownFile, [fileId, content, sessionId]);
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
