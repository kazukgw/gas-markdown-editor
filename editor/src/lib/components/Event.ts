import { writable } from "svelte/store";

export enum EventType {
  createNewFile = "createNewFile",
  editorChange = "editorChange",
  changeFileName = "changeFileName",
  searchFileEvent = "searchFileEvent",
  vimEvent = "vimEvent",
}

export class CreateNewFileEvent {
  name = EventType.createNewFile;
  fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName || "";
  }
}
export const createNewFileEventPub = writable();


export class EditorChangeEvent {
  name = EventType.editorChange;
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
export const editorChangeEventPub = writable();


export class ChangeFileNameEvent {
  name = EventType.changeFileName;
  fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }
}
export const changeFileNameEventPub = writable();


export class SearchFileEvent {
  name = EventType.searchFileEvent;
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
export const searchFileEventPub = writable();

export const modeEventPub = writable();
