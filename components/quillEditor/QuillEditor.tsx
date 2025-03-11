"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill's Snow theme CSS

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    toolbarId?: string; // Unique ID for the toolbar
}

export default function QuillEditor({ value, onChange, toolbarId }: QuillEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            // Define the toolbar options
            const toolbarOptions = [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ color: [] }, { background: [] }],
                ["link", "image"],
                ["clean"],
            ];

            // Initialize Quill with the toolbar
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: toolbarOptions, // Attach the toolbar options
                },
            });

            // Set initial value
            quillRef.current.on("text-change", () => {
                const content = quillRef.current?.root.innerHTML || "";
                onChange(content);
            });

            quillRef.current.root.innerHTML = value;
        }
    }, [value, onChange, toolbarId]);

    return (
        <div>
            <div className="w-full h-64 bg-white" dir="ltr" ref={editorRef} />
        </div>
    );
}