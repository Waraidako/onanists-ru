"use client"

import styles from "./note.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

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

    const [ note, setNote ] = useState("");
    const [ nextPath, setNextPath ] = useState('');
    const [ prevPath, setPrevPath ] = useState('');

    const fetchData = async () => {
        let request = await fetch('/api/get-note?path=' + encodeURIComponent(notePath!));
        let json = await request.json();
        const noteText = json.noteText;
        setNote(noteText);

        const subject = notePath!.split('/')[0];
        request = await fetch('api/get-filenames?dir=' + encodeURIComponent(subject));
        json = await request.json();
        const filenames = json.files;
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
            const appendedLink: string = "https://onanists:onanists123@obsidian.servermaksa.ru/" + notePath!.split('/')[0] + '/' + nonAppendedLink;
            img.setAttribute('src', appendedLink);
        });

        return parsedHTML.documentElement.outerHTML;
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className={"flex justify-center"}>
            <div className={styles.note}>
                <h1 className={"flex justify-center"}>{notePath!.split('/')[0]}</h1>
                <h2 className={"flex justify-center"}>{notePath!.split('/')[1]}</h2>
                {
                    note
                        ?
                            <div className={styles.note}>
                            <div dangerouslySetInnerHTML={{__html: renderHeader + appendLinks(marked.parse(note, { async: false }))}} />
                            <div className={"flex w-full"}>
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