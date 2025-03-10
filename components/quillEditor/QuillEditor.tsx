"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "./style.css"; // Import the Quill CSS for styling
interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ color: [] }, { background: [] }], // Make sure this is included
                        ["link", "image"],
                    ],
                },
                formats: ["bold", "italic", "underline", "header", "list", "color", "background", "link", "image"],
            });
            // Set initial value
            quillRef.current.on("text-change", () => {
                const content = quillRef.current?.root.innerHTML || "";
                onChange(content);
            });
            quillRef.current.root.innerHTML = value;
        }
    }, [value, onChange]);

    return <div className="w-full h-64 bg-white" dir="ltr" ref={editorRef} />;
}