import React from "react";
import Subject from "./components/Subject";
import { Obsidian } from "./utils/obsidian"



const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");
const allPaths: string[] = await obsidian.getAllFilesList();
const directories: Map<string, string[]> = new Map<string, string[]>();
allPaths.forEach((path: string) => {
    const splitPath = path.split("/");
    if (splitPath.length < 2) { return; }
    if (splitPath[1] === "Пикчи") { return; }
    if (directories.get(splitPath[0]) === undefined) { directories.set(splitPath[0], []) }
    directories.get(splitPath[0])!.push(splitPath[1].split(".").slice(0, -1).join('.'));
})

export default function Home() {
  return (
      <div className="m-[1.5em] flex-col justify-items-center">
          <a href={"https://files.servermaksa.ru/2025-09-09_20-05-14.mp4"} className={"flex justify-center text-2xl w-full font-montserrat mb-7"}>Собрание по ВКРБ</a>
          {
              Array.from(directories.entries()).map(([key, value]) => (
                  <Subject key={key} subjectName={key} filenames={value} />
              ))
          }
      </div>
  );
}