import { spawn } from "child_process";
import { homedir } from "os";

export const getHomeDir = () => homedir();

const passCli = (args: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cli = spawn("pass", args, {
      env: {
        HOME: homedir(),
        PATH: [
          "/bin", // osascript
          "/usr/bin", // osascript
          "/usr/local/bin", // gpg
          "/usr/local/MacGPG2/bin", // gpg
          "/opt/homebrew/bin", // homebrew on macOS Apple Silicon
        ].join(":"),
      },
    });

    cli.on("error", reject);

    const stderr: Buffer[] = [];
    cli.stderr.on("data", (chunk: Buffer): number => stderr.push(chunk));
    cli.stderr.on("end", () => stderr.length > 0 && reject(stderr.join("")));

    const stdout: Buffer[] = [];
    cli.stdout.on("data", (chunk: Buffer): number => stdout.push(chunk));
    cli.stdout.on("end", () => resolve(stdout.join("")));
  });
};

export const copyToClipboard = async ({ pass, isOTP }: { pass: string; isOTP?: boolean }): Promise<string> => {
  const res = await passCli([...(isOTP ? ["otp"] : []), "-c", pass]);
  return res;
};

export const getPassList = async (): Promise<string[]> => {
  const res = await passCli(["ls"]);
  const lines = res
    .split("\n")
    .splice(1)
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/`-- /g, "|-- "));

  const passList: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const name = getLineName(line);
    const { children, lastLine } = getChildrenOfLine(i, lines);
    if (children.length > 0) {
      passList.push(...children);
      i = lastLine - 1;
    } else {
      passList.push(name);
    }
  }

  return passList;
};

const getLineDepth = (line: string): number => Math.floor(line.lastIndexOf("|--") / 4);
const getLineName = (line: string): string => line.replace(/\|-- /g, "").replace(/\| */g, "");

const getChildrenOfLine = (lineIndex: number, lines: string[]): { children: string[]; lastLine: number } => {
  const name = getLineName(lines[lineIndex]);
  const children: string[] = [];
  const lineDepth = getLineDepth(lines[lineIndex]);
  let lastLine = lineIndex;

  for (let j = lineIndex + 1; j < lines.length; j++) {
    const nextLineDepth = getLineDepth(lines[j]);
    if (nextLineDepth > lineDepth) {
      const { children: grandChildren, lastLine } = getChildrenOfLine(j, lines);
      if (grandChildren.length > 0) {
        const formattedGrandChildren = grandChildren.map((grandChild) => `${name}/${grandChild}`);
        children.push(...formattedGrandChildren);
        j = lastLine - 1;
      } else {
        const child = getLineName(lines[j]);
        const formattedChild = `${name}/${child}`;
        children.push(formattedChild);
      }
    } else {
      lastLine = j;
      break;
    }
  }

  return { children, lastLine };
};

export const filterList = <T extends string>(query: T, items: T[]): T[] => {
  if (query.length > 0) {
    const filteredList = items.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase());
    });
    return filteredList;
  } else {
    return items;
  }
};
