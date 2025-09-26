"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Subject from "@/app/components/Subject";
import Loading from '@/app/components/Loading';

const ttl = 3600000;

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

export default function Home() {
    const [ directories, setDirectories ] = useState<Map<string, string[]>>();

    const fetchData = async () => {
        const req = await fetch("/api/get-directories");
        const json = await req.json();
        setDirectories(new Map(Object.entries(JSON.parse(json.directories))));
        const cookie = { data: json.directories, expiresOn: new Date().getTime() + ttl };
        localStorage.setItem("directories", JSON.stringify(cookie));
        // ^ A whole lot of hoopla up there lmao
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="m-[1.5em] flex-col justify-items-center">
            <a href={"https://files.servermaksa.ru/2025-09-09_20-05-14.mp4"} className={"flex justify-center text-2xl w-full font-montserrat mb-7"}>Собрание по ВКРБ</a>
            {
                directories
                ? <SubjectList directories={ directories } />
                : <Loading />
            }
        </div>
);
}