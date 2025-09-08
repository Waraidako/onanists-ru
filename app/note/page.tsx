"use client"

import styles from "./note.module.css";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export default function Page() {
    const params  = useSearchParams();
    const noteName: string | null = params.get("path");
    //const noteName = "Stonks 101/README darkmode.html";
    if (!noteName) {
        window.location.replace('/piss');
    }

    const [ note, setNote ] = useState("");

    const fetchData = async () => {
        const request = await fetch('/api/get-note?path=' + encodeURIComponent(noteName!));
        const json = await request.json();
        const noteText = json.noteText;
        setNote(noteText);
    }

    useEffect(() => {
        fetchData();
    })

    return (
        <div className={"flex justify-center"}>
            <div>
                <h1 className={"flex justify-center"}>{noteName!.split('/')[0]}</h1>
                <h2 className={"flex justify-center"}>{noteName!.split('/')[1].slice(0, -5)}</h2>
                {
                    note
                        ? <div dangerouslySetInnerHTML={{__html: note}} className={styles.note} />
                        : <div className={"flex justify-center items-center"}>Loading please wait... 100%</div>
                }
            </div>
        </div>
    )
}