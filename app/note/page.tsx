"use client"

import styles from "./note.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
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



export default function Page()  {
    const params  = useSearchParams();
    const notePath: string | null = params.get("path");
    if (!notePath) {
        window.location.replace('/piss');
    }

    const [ note, setNote ] = useState('');
    const [ nextPath, setNextPath ] = useState('');
    const [ prevPath, setPrevPath ] = useState('');

    const getNote = async () => {
        const request = await fetch('/api/get-note?path=' + encodeURIComponent(notePath!));
        const json = await request.json();
        const noteText = json.noteText;
        setNote(noteText);
    }

    const fetchData = async () => {
        const subject = notePath!.split('/')[0];

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

        const directories: Map<string, string[]> = new Map(Object.entries(JSON.parse(json)));
        const filenames: string[] = directories.get(subject)!;
        const noteName = notePath!.split('/')[1];
        const noteIndex = filenames.indexOf(noteName);
        if (noteIndex > 0) setPrevPath(subject + '/' + filenames[noteIndex - 1])
        if (noteIndex < filenames.length - 1) setNextPath(subject + '/' + filenames[noteIndex + 1]);
    }

    marked.use(markedKatex(KatexOptions));
    marked.setOptions(options);

    function appendLinks(note: string): string {
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(note, 'text/html');
        Array.from(parsedHTML.getElementsByTagName('img')).forEach((img) => {
            const nonAppendedLink: string = img.getAttribute('src')!;
            const appendedLink: string = "/api/get-picture?path=" + notePath!.split('/')[0] + '/' + nonAppendedLink;
            img.setAttribute('src', appendedLink);
        });

        return parsedHTML.documentElement.outerHTML;
    }

    useEffect(() => {
        fetchData();
        getNote();
        
        const interval = setInterval(getNote, 750);
        return () => clearInterval(interval);
    }, [])

    

    return (
        <div className={"flex justify-center"}>
            <div className={styles.note}>
                <div className={"print:hidden"}>
                    <button
                        className={` nextprevbutton flex justify-center w-full text-2xl font-montserrat `}
                        role={'button'}
                        onClick={() => window.print()}>
                            Печать в PDF
                    </button>
                </div>
                <h1 className={"flex justify-center"}>{notePath!.split('/')[0]}</h1>
                <h2 className={"flex justify-center"}>{notePath!.split('/')[1]}</h2>
                {
                    note
                        ?
                            <div className={styles.note}>
                            <div dangerouslySetInnerHTML={{__html: renderHeader + appendLinks(marked.parse(note, { async: false }))}} />
                            <div className={"flex w-full print:hidden"}>
                                {
                                    prevPath
                                        ? <div className="flex w-1/2 mr-1 justify-center">
                                            <a href={`note?path=${prevPath}`} className={"nextprevbutton w-full"}>&lt;-</a>
                                        </div>
                                        : <div className={"flex w-1/2 mr-1 justify-center"} />
                                }
                                {
                                    nextPath
                                        ? <div className="flex w-1/2 ml-1 justify-center">
                                            <a href={`note?path=${nextPath}`} className={"nextprevbutton w-full"}>
                                                -&gt;
                                            </a>
                                        </div>
                                        : <div className={"flex w-1/2 lr-1 justify-center"} />
                                }
                            </div>
                          </div>
                        : <div className={"flex justify-center items-center"}>Loading please wait... 100%</div>
                }

            </div>
        </div>
    )
}