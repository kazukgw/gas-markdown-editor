import {
  createNewFileEventPub,
  CreateNewFileEvent,
  searchFileEventPub,
  SearchFileEvent,
  modeEventPub,
} from './Event.ts';

class Command {
  names: string[];

  matchCommandName(commandName: string) {
    return this.names.includes(commandName.toLowerCase())
  }

  run(_: string[]) {
    return null;
  }
}

const searchCommand = new (class extends Command {
  names = ["s", "search", "searchFiles"];

  run(args: string[]) {
    searchFileEventPub.set(new SearchFileEvent(args.join(" ")));
  }
});

const createNewFileCommand = new (class extends Command {
  names = ["c", "create", "createNewFile"];

  run(args: string[]) {
    createNewFileEventPub.set(new CreateNewFileEvent(args[0]));
  }
});

const modeCommand = new (class extends Command {
  names = ["mode"];

  run(args: string[]) {
    modeEventPub.set(true);
  }
});

export const commands: Command[] = [
  searchCommand,
  createNewFileCommand,
  modeCommand,
];

export function runCommand(commandValue) {
  const values = commandValue.split(" ");
  let commandName = values.shift();
  let args;
  if(commandName.match("^:")) {
    commandName = commandName.slice(1);
  } else {
    args = values.unshift(commandName);
    commandName = "search";
  }
  args = values;
  console.log(`run commandName: ${commandName} args: ${JSON.stringify(args)}`);
  for (const command of commands) {
    if(command.matchCommandName(commandName)) {
      return command.run(args);
    };
  }
}

export class CommandResults {
  message: string;
  results: any[];

  constructor(message: string, results: any[]){
    this.message = message;
    this.results = results;
  }
}

interface Result {
  html: () => string
} export class ResultTypeError implements Result {
  message: string;
  error: any;

  constructor(message: string, error: any) {
    this.message = message;
    this.error = error;
  }

  html() {
    return `
      <p><span>${this.message + ": "}</span> ${JSON.stringify(this.error)}</p>
    `;
  }
}

export class ResultTypeFile implements Result {
  prefix: string;
  fileName: string;
  fileCaption: string;
  fileUrl: string;

  constructor(
    prefix: string,
    fileName: string,
    fileCaption: string,
    fileUrl: string,
  ) {
    this.prefix = prefix;
    this.fileName = fileName;
    this.fileCaption = fileCaption;
    this.fileUrl = fileUrl;
  }

  html() {
    return `
      <p>
        <span>${this.prefix}</span>
        <a class="filename" target="_blank" href="${this.fileUrl}">${this.fileName}</a>
        <span>${(!!this.fileCaption ? "(" + this.fileCaption + ")" : "")}</span>
      </p>
    `;
  }
}
