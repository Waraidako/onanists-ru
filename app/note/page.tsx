"use client"

import styles from "./note.module.css";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export default function Page() {
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
        const noteName = notePath!.split('/')[1].split('.').slice(0, -1).join('.');
        const noteIndex = filenames.indexOf(noteName);
        console.log(noteIndex);
        console.log(filenames);
        console.log(noteName);
        if (noteIndex > 0) setPrevPath(subject + '/' + filenames[noteIndex - 1] + '.html')
        if (noteIndex < filenames.length - 1) setNextPath(subject + '/' + filenames[noteIndex + 1] + '.html');
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className={"flex justify-center"}>
            <div className={styles.note}>
                <h1 className={"flex justify-center"}>{notePath!.split('/')[0]}</h1>
                <h2 className={"flex justify-center"}>{notePath!.split('/')[1].slice(0, -5)}</h2>
                {
                    note
                        ? <div dangerouslySetInnerHTML={{__html: note}} className={styles.note} />
                        : <div className={"flex justify-center items-center"}>Loading please wait... 100%</div>
                }
                <div className={"flex w-full ml-[1.5em] mr-[1.5em]"}>
                {
                    prevPath
                        ? <div className="flex w-1/2 mr-1 justify-center">
                            <a href={`note?path=${prevPath}`}>
                                <button className={"nextprevbutton"}>&lt;- Предыдущий конспект</button>
                            </a>
                          </div>
                        : <div className={"flex w-1/2 justify-center"} />
                }
                {
                    nextPath
                        ? <div className="flex w-1/2 ml-1 justify-center">
                            <a href={`note?path=${nextPath}`}>
                                <button className={"nextprevbutton w-full"}>Следующий конспект -&gt;</button>
                            </a>
                          </div>
                        : null
                }
                        </div>
            </div>
        </div>
    )
}