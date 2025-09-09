import React from "react";
import Subject from "./components/Subject";
import parseDirectories from "./utils/DirectoryParser";

const directories: string[] = parseDirectories('files').sort();

export default function Home() {
  return (
      <div className="m-[1.5em] flex-col justify-items-center">
          <a href={"https://files.servermaksa.ru/2025-09-09_20-05-14.mp4"} className={"flex justify-center text-2xl w-full font-montserrat"}>Собрание по ВКРБ</a>
          {
              directories.map(((directory: string, index: number) => (
                  <Subject key={index} subjectName={directory} />
              )))
          }
      </div>
  );
}