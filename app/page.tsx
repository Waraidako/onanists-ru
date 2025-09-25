import React from 'react';
import Subject from "@/app/components/Subject";

function SubjectList({ directories }: { directories: Map<string, string[]> }) {
    return (
        <div>
            {
                Array.from(directories.entries()).map(([key, value]: [string, string[]]) => (
                    <Subject key={key} subjectName={key} filenames={value}/>
                ))
            }
        </div>
    )
}

export default async function Home() {
    const req = await fetch("http://localhost:3000/api/get-directories");
    const json = await req.json();
    const directories: Map<string, string[]> = new Map(Object.entries(JSON.parse(json.directories)));
    // ^ A whole lot of hoopla up there lmao

    return (
        <div className="m-[1.5em] flex-col justify-items-center">
            <a href={"https://files.servermaksa.ru/2025-09-09_20-05-14.mp4"} className={"flex justify-center text-2xl w-full font-montserrat mb-7"}>Собрание по ВКРБ</a>
                <SubjectList directories={ directories } />
        </div>
);
}