import React from "react";
import Subject from "./components/Subject";
import parseDirectories from "./utils/DirectoryParser";

const directories: string[] = parseDirectories('files').sort();

export default function Home() {
  return (
      <div className="m-[1.5em] flex-col justify-items-center">
          {
              directories.map(((directory: string, index: number) => (
                  <Subject key={index} subjectName={directory} />
              )))
          }
      </div>
  );
}