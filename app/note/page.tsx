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
            {
                note
                ? <div dangerouslySetInnerHTML={{__html: note}} className={styles.note} />
                : <div className={"flex justify-center items-center"}>Loading please wait... 100%</div>
            }
        </div>
    )
}