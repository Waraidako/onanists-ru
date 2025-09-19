"use client";

import Collapse from "./CollapsibleButton";
import HrefBlock from "@/app/components/HrefBlock";
import React from "react";
import { useState, useEffect } from "react";

const pdf_ext = '.pdf';

export default function Subject({subjectName, filenames}: {subjectName:string, filenames:string[]}) {
    const [ theme, setTheme ] = useState("dark");
    const currentTheme = theme === "light" ? "light" : "dark";

    useEffect(() => {

        const themeChangeHandler = () => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
        }

        document.addEventListener('theme-change', themeChangeHandler as EventListener);

        const getTheme = () => {
            const cookieValue = document.cookie
                .split('; ')
                .find((row) => row.startsWith('theme='))
                ?.split('=')[1];

            if (cookieValue === 'dark' || cookieValue === 'light') {
                setTheme(cookieValue);
            }
        }

        getTheme();
        return () => document.removeEventListener('theme-change', themeChangeHandler as EventListener);
    }, [subjectName, theme]);
    return (
        <Collapse name={subjectName}>
            <div className="flex-col w-full text-[15px] mt-2 mb-2">
                <div className="mr-1 pb-1 justify-items-center h-full"><a href={"/full-subject?subject=" + encodeURIComponent(subjectName)}><button className="hrefbutton allbutton w-full" role="button">Всё разом</button></a></div>
                {
                    filenames.map((filename:string, index: number) => {
                        const themedFilename = filename + (currentTheme == 'dark' ? ' darkmode' : ' lightmode');
                        return(
                            <HrefBlock key={index} name={filename} href_html={`note?path=${subjectName}/${filename}`} href_pdf={`files/${subjectName}/${themedFilename}${pdf_ext}`} />
                    )})
                }
            </div>
        </Collapse>
    )
}
