import React from "react";
import Subject from '@/app/components/Subject';

const request = await fetch("http://localhost:3000/api/get-directories");
const json = await request.json();
const directories: Map<string, string[]> = json.directories;

export default function SubjectList() {
    return (
        <div>
            {
                directories
                ? Array.from(directories.entries()).map(([key, value]: [string, string[]]) => (
                    <Subject key={key} subjectName={key} filenames={value}/>
                ))
                    : null
            }
        </div>
    )
}