"use client";

import React, { FC, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Base64UploadAdapter,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Indent,
  IndentBlock,
  Link,
  List,
  Font,
  FontSize, // FontSize plugin
  FontFamily, // FontFamily plugin
  Alignment, // Add Alignment plugin
  Mention,
  Paragraph,
  PasteFromOffice,
  Table,
  TableColumnResize,
  TableToolbar,
  TextTransformation,
  SourceEditing,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "./style.css";

interface CkEditorProps {
  editorData: string;
  setEditorData: React.Dispatch<React.SetStateAction<string>>;
  handleOnUpdate: (editor: string, field: string) => void;
  config?: {
    language?: string;
    direction?: string;
    placeholder?: string;
    toolbar?: string;
    height?: string;
  };
}

const CkEditor: FC<CkEditorProps> = ({
  setEditorData,
  editorData,
  handleOnUpdate,
  config,
}) => {
  useEffect(() => {
    // console.log("what is editorData: ", editorData);
  }, [editorData]);

  return (
    <div className="ckeditor-container" // Set height dynamically 
    >
      <CKEditor
        editor={ClassicEditor}
        config={{
          ...config,
          licenseKey: "GPL",
          plugins: [
            Autoformat,
            BlockQuote,
            Bold,
            CloudServices,
            Essentials,
            Heading,
            Image,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Base64UploadAdapter,
            Indent,
            IndentBlock,
            Italic,
            Link,
            Font,
            FontSize, // FontSize plugin
            FontFamily, // FontFamily plugin
            Alignment, // Add Alignment plugin
            List,
            Mention,
            Paragraph,
            PasteFromOffice,
            PictureEditing,
            Table,
            TableColumnResize,
            TableToolbar,
            TextTransformation,
            Underline,
            SourceEditing,
          ],
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "link",
            "uploadImage",
            "insertTable",
            "blockQuote",
            "|",
            "fontSize", // Font size dropdown
            "fontFamily", // Font family dropdown
            "fontColor",
            "fontBackgroundColor",
            "|",
            "alignment", // Add alignment dropdown
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "sourceEditing",
          ],
          fontSize: {
            options: [10, 12, 14, "default", 18, 20, 24], // Define font size options
            supportAllValues: false, // Set to true if you want to allow any font size
          },
          fontFamily: {
            options: [
              "default", // Use the default font
              "Arial, Helvetica, sans-serif",
              "Courier New, Courier, monospace",
              "Georgia, serif",
              "Times New Roman, Times, serif",
              "Verdana, Geneva, sans-serif",
              "Comic Sans MS, cursive",
              "Qahiri, sans-serif",
              "Cairo, sans-serif",
              "Aref Ruqaa, serif",
              "El Messiri, sans-serif",
              "Reem Kufi, sans-serif",
              "Almarai, sans-serif",
              "Amiri, serif",
            ],
            supportAllValues: false, // Set to true if you want to allow any font family
          },
          alignment: {
            options: ["left", "center", "right", "justify"], // Define alignment options
          },
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
              {
                model: "heading5",
                view: "h5",
                title: "Heading 5",
                class: "ck-heading_heading5",
              },
              {
                model: "heading6",
                view: "h6",
                title: "Heading 6",
                class: "ck-heading_heading6",
              },
            ],
          },
          image: {
            resizeOptions: [
              {
                name: "resizeImage:original",
                label: "Default image width",
                value: null,
              },
              {
                name: "resizeImage:50",
                label: "50% page width",
                value: "50",
              },
              {
                name: "resizeImage:75",
                label: "75% page width",
                value: "75",
              },
            ],
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "|",
              "resizeImage",
            ],
          },
          fontColor: {
            colors: [
              {
                color: "hsl(0, 0%, 0%)",
                label: "Black",
              },
              {
                color: "hsl(0, 0%, 30%)",
                label: "Dim grey",
              },
              {
                color: "hsl(0, 0%, 60%)",
                label: "Grey",
              },
              {
                color: "hsl(0, 0%, 90%)",
                label: "Light grey",
              },
              {
                color: "hsl(0, 0%, 100%)",
                label: "White",
                hasBorder: true,
              },
              {
                color: "hsl(0, 0%, 100%)",
                label: "White",
                hasBorder: true,
              },
              {
                color: "hsl(0, 75%, 60%)",
                label: "Red",
              },
              {
                color: "hsl(30, 75%, 60%)",
                label: "Orange",
              },
              {
                color: "hsl(60, 75%, 60%)",
                label: "Yellow",
              },
              {
                color: "hsl(90, 75%, 60%)",
                label: "Light green",
              },
              {
                color: "hsl(120, 75%, 60%)",
                label: "Green",
              },
            ],
          },
          fontBackgroundColor: {
            colors: [
              {
                color: "hsl(0, 75%, 60%)",
                label: "Red",
              },
              {
                color: "hsl(30, 75%, 60%)",
                label: "Orange",
              },
              {
                color: "hsl(60, 75%, 60%)",
                label: "Yellow",
              },
              {
                color: "hsl(90, 75%, 60%)",
                label: "Light green",
              },
              {
                color: "hsl(120, 75%, 60%)",
                label: "Green",
              },
              {
                color: "hsl(0, 0%, 0%)",
                label: "Black",
              },
              {
                color: "hsl(0, 0%, 30%)",
                label: "Dim grey",
              },
              {
                color: "hsl(0, 0%, 60%)",
                label: "Grey",
              },
              {
                color: "hsl(0, 0%, 90%)",
                label: "Light grey",
              },
            ],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          initialData: editorData,
        }}
        onChange={(_event, editor) => {
          const data = editor.getData();
          setEditorData(data);
          handleOnUpdate(data, "description");
        }}
        onFocus={() => console.log("Editor focused")}
        onBlur={() => console.log("Editor blurred")}
      />
    </div>
  );
};

export default CkEditor;