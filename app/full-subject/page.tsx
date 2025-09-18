"use client"

import styles from './full-subject.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const KatexOptions = {
    throwOnError: true,
}

const options = {
    gfm: true,
    breaks: true,
}

export default function Page() {

    const [ noteNamesArray, setNoteNamesArray ] = useState<string[]>([]);
    const [ notesArray, setNotesArray ] = useState<string[]>([]);

    const params = useSearchParams();
    const subjectName = params.get('subject');
    if (!subjectName) {
        window.location.replace('/piss');
    }

    async function fetchData() {
        const request = await fetch('/api/get-filenames?dir=' + encodeURIComponent(subjectName!));
        const json = await request.json();
        const noteNames = json.files;
        setNoteNamesArray(noteNames);

        const notesPromises = noteNames.map(async (noteName: string) => {
            const req = await fetch('/api/get-note?path=' + encodeURIComponent(subjectName + '/' + noteName));
            const notejson = await req.json();
            return notejson.noteText;
        })
        const fetchedNotes = await Promise.all(notesPromises);

        setNotesArray(fetchedNotes);
    }

    useEffect(() => {
        fetchData();
    }, []);

    marked.use(markedKatex(KatexOptions));
    marked.setOptions(options);

    return (
        <div className={"flex justify-center"}>
            <div>
            <h1 className={"flex justify-center"}>{subjectName}</h1>
            {
                noteNamesArray.map((noteName: string, index: number) => {
                    return (
                        <div key={index}>
                            <h2 className={"flex justify-center"}>{noteName}</h2>
                            <div dangerouslySetInnerHTML={{__html: notesArray[index] ? marked.parse(notesArray[index]) : ""}} className={styles.fullsubject}/>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}