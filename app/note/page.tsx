"use client"

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export default function Page() {
    const params  = useSearchParams();
    const noteName: string | null = params.get("name");
    if (!noteName) {
        window.location.replace('/piss');
    }

    const fetchData = async () => {
        const request = await fetch('/api/get-note?name=' + encodeURIComponent(noteName!));
        const json = await request.json();
    }

    useEffect(() => {
        fetchData();
    })

    return (
        <div></div>
    )
}