//import SubjectList from "./components/SubjectList";
import React, { Suspense } from 'react';
import Loading from '@/app/components/Loading';
import Subject from "@/app/components/Subject";

//const req = await fetch("http://localhost:3000/api/get-directories");
//const json = await req.json();

function SubjectList({ directories }: { directories: Record<string, string[]> }) {
    return (
        <div>
            {
                Object.entries(directories).map(([key, value]: [string, string[]]) => (
                    <Subject key={key} subjectName={key} filenames={value}/>
                ))
            }
        </div>
    )
}

export default async function Home() {
    const req = await fetch("http://localhost:3000/api/get-directories");
    const json = await req.json();
    const directories: Record<string, string[]> = json.directories;

    return (
        <div className="m-[1.5em] flex-col justify-items-center">
            <a href={"https://files.servermaksa.ru/2025-09-09_20-05-14.mp4"} className={"flex justify-center text-2xl w-full font-montserrat mb-7"}>Собрание по ВКРБ</a>
            <Suspense fallback={<Loading />}>
                <SubjectList directories={ directories } />
            </Suspense>
        </div>
    );
}