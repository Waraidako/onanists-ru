"use client"

import styles from './full-subject.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const ttl = 3600000;

const renderHeader = `<link 
    rel="stylesheet" 
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" 
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" 
    crossorigin="anonymous"
    />
`

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
        // const request = await fetch('/api/get-filenames?dir=' + encodeURIComponent(subjectName!));
        // const json = await request.json();
        // const noteNames = json.files;
        // setNoteNamesArray(noteNames);

        const cookie = localStorage.getItem('directories');
        const currentTime = new Date().getTime();
        let json: string = '';
        if (cookie === null || JSON.parse(cookie).expiresOn < currentTime) {
            const request = await fetch('api/get-directories');
            json = (await request.json()).directories;
            const cookie = { data: json, expiresOn: new Date().getTime() + ttl };
            localStorage.setItem("directories", JSON.stringify(cookie));
        } else {
            json = JSON.parse(cookie).data;
        }
        console.log(json);
        const directories: Map<string, string[]> = new Map(Object.entries(JSON.parse(json)));
        console.log('fully parsed');
        const noteNames: string[] = directories.get(subjectName!)!;
        setNoteNamesArray(noteNames);

        const notesPromises = noteNames.map(async (noteName: string) => {
            const req = await fetch('/api/get-note?path=' + encodeURIComponent(subjectName + '/' + noteName));
            //console.log(await req);
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

    function appendLinks(note: string): string {
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(note, 'text/html');
        Array.from(parsedHTML.getElementsByTagName('img')).forEach((img) => {
            const nonAppendedLink: string = img.getAttribute('src')!;
            const appendedLink: string = "/api/get-picture?path=" + subjectName + '/' + nonAppendedLink;
            img.setAttribute('src', appendedLink);
        });

        return parsedHTML.documentElement.outerHTML;
    }

    return (
        <div className={"flex justify-center"}>
            <div className={styles.fullsubject}>
            <h1 className={"flex justify-center"}>{subjectName}</h1>
            {
                noteNamesArray.map((noteName: string, index: number) => {
                    return (
                        <div key={index} className={ styles.fullsubject }>
                            <h2 className={"flex justify-center"}>{noteName}</h2>
                            <div dangerouslySetInnerHTML={{__html: notesArray[index] ? renderHeader + appendLinks(marked.parse(notesArray[index], { async: false })) : ""}}/>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}