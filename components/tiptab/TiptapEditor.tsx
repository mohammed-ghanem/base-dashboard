"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";
import { Editor } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
} from "lucide-react";
import { Button, Select, Tooltip, Input, Switch } from "antd";

// Extend Tiptap Commands for Font Family and Font Size
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    setFontFamily: {
      setFontFamily: (fontFamily: string) => ReturnType;
      unsetFontFamily: () => ReturnType;
    };
    setFontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

// Font Family Extension
const FontFamily = Extension.create({
  name: "fontFamily",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily?.replace(/['"]+/g, ""),
            renderHTML: (attributes) =>
              attributes.fontFamily ? { style: `font-family: ${attributes.fontFamily}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontFamily }).run(),
      unsetFontFamily:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontFamily: null }).removeEmptyTextStyle().run(),
    };
  },
});

// Font Size Extension
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

// Font Family Options
const fontFamilies = [
  { label: "Arial", value: "Arial" },
  { label: "Courier New", value: "Courier New" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Verdana", value: "Verdana" },
  {lable : "Qahiri" , value : "Qahiri"},
  {lable : "Amiri" , value : "Amiri"},
];

// Font Size Options
const fontSizes = [
  { label: "Small", value: "12px" },
  { label: "Normal", value: "16px" },
  { label: "Large", value: "20px" },
  { label: "Huge", value: "24px" },
];

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: true, allowBase64: true }),
      Placeholder.configure({ placeholder: "Write something..." }),
    ],
    content: "<p>Hello, <strong>world!</strong></p>",
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-4 w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-2 border-b pb-2">
        {/* Font Family Dropdown */}
        <Select
          defaultValue="Arial"
          style={{ width: 120 }}
          onChange={(value: string) => editor.chain().focus().setFontFamily(value).run()}
          options={fontFamilies}
        />

        {/* Font Size Dropdown */}
        <Select
          defaultValue="16px"
          style={{ width: 100 }}
          onChange={(value: string) => editor.chain().focus().setFontSize(value).run()}
          options={fontSizes}
        />

        {/* Text Formatting Buttons */}
        {[
          { icon: <Bold size={18} />, command: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
          { icon: <Italic size={18} />, command: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
          { icon: <Strikethrough size={18} />, command: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), title: "Strikethrough" },
          { icon: <UnderlineIcon size={18} />, command: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), title: "Underline" },
        ].map(({ icon, command, active, title }, index) => (
          <Tooltip key={index} title={title}>
            <Button onClick={command} className={active ? "bg-gray-300" : ""}>
              {icon}
            </Button>
          </Tooltip>
        ))}

        {/* Text Alignment Buttons */}
        {[
          { icon: <AlignLeft size={18} />, command: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }), title: "Align Left" },
          { icon: <AlignCenter size={18} />, command: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }), title: "Align Center" },
          { icon: <AlignRight size={18} />, command: () => editor.chain().focus().setTextAlign("right").run(), active: editor.isActive({ textAlign: "right" }), title: "Align Right" },
          { icon: <AlignJustify size={18} />, command: () => editor.chain().focus().setTextAlign("justify").run(), active: editor.isActive({ textAlign: "justify" }), title: "Justify" },
        ].map(({ icon, command, active, title }, index) => (
          <Tooltip key={index} title={title}>
            <Button onClick={command} className={active ? "bg-gray-300" : ""}>
              {icon}
            </Button>
          </Tooltip>
        ))}

        {/* Text Color Picker */}
        <Input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          style={{ width: 40 }}
        />

        {/* Image Upload */}
        <Tooltip title="Insert Image">
          <Button onClick={() => editor.chain().focus().setImage({ src: "https://via.placeholder.com/150" }).run()}>
            <ImageIcon size={18} />
          </Button>
        </Tooltip>

        {/* Undo & Redo */}
        <Tooltip title="Undo">
          <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo size={18} />
          </Button>
        </Tooltip>
        <Tooltip title="Redo">
          <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo size={18} />
          </Button>
        </Tooltip>

        {/* Read-Only Mode Toggle */}
        <Tooltip title="Toggle Read-Only Mode">
          <Switch
            checked={!editor.isEditable}
            onChange={() => editor.setEditable(!editor.isEditable)}
          />
        </Tooltip>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="border rounded-md p-3 min-h-[200px]" />

      {/* Save Content Button */}
      <Button onClick={() => console.log(editor.getHTML())} className="mt-4">
        Save Content
      </Button>
    </div>
  );
};

export default TiptapEditor;



// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Heading from "@tiptap/extension-heading";
// import TextAlign from "@tiptap/extension-text-align";
// import TextStyle from "@tiptap/extension-text-style";
// import Color from "@tiptap/extension-color";
// import { Extension } from "@tiptap/core";
// import { Editor } from "@tiptap/core";
// import {
//   Bold,
//   Italic,
//   Strikethrough,
//   Underline as UnderlineIcon,
//   Undo,
//   Redo,
// } from "lucide-react";
// import { Button, Select } from "antd";

// // Extend Tiptap Commands for Font Family
// declare module "@tiptap/core" {
//   interface Commands<ReturnType> {
//     setFontFamily: {
//       /**
//        * Set the font family
//        */
//       setFontFamily: (fontFamily: string) => ReturnType;
//       /**
//        * Unset the font family
//        */
//       unsetFontFamily: () => ReturnType;
//     };
//   }
// }

// // Font Family Extension
// const FontFamily = Extension.create({
//   name: "fontFamily",

//   addGlobalAttributes() {
//     return [
//       {
//         types: ["textStyle"],
//         attributes: {
//           fontFamily: {
//             default: null,
//             parseHTML: (element: HTMLElement) => element.style.fontFamily?.replace(/['"]+/g, ""),
//             renderHTML: (attributes: { fontFamily?: string }) =>
//               attributes.fontFamily ? { style: `font-family: ${attributes.fontFamily}` } : {},
//           },
//         },
//       },
//     ];
//   },

//   addCommands() {
//     return {
//       setFontFamily:
//         (fontFamily: string) =>
//         ({ chain }: { chain: () => any }) => {
//           return chain().setMark("textStyle", { fontFamily }).run();
//         },
//       unsetFontFamily:
//         () =>
//         ({ chain }: { chain: () => any }) => {
//           return chain().setMark("textStyle", { fontFamily: null }).removeEmptyTextStyle().run();
//         },
//     };
//   },
// });



// // Font Family Options
// const fontFamilies = [
//   { label: "Arial", value: "Arial" },
//   { label: "Courier New", value: "Courier New" },
//   { label: "Georgia", value: "Georgia" },
//   { label: "Times New Roman", value: "Times New Roman" },
//   { label: "Verdana", value: "Verdana" },
//   {lable : "cairo", value : "cairo"}
// ];

// const TiptapEditor = () => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       TextStyle,
//       Color,
//       FontFamily, // Include Font Family Extension
//       Heading.configure({ levels: [1, 2, 3] }),
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//     ],
//     content: "<p>Hello, <strong>world!</strong></p>",
//   });

//   if (!editor) return null;

//   return (
//     <div className="border rounded-lg p-4 w-full max-w-2xl mx-auto">
//       <div className="flex flex-wrap gap-2 mb-2 border-b pb-2">
//         {/* Formatting Buttons */}
//         {[
//           {
//             icon: <Bold size={18} />,
//             command: () => editor.chain().focus().toggleBold().run(),
//             active: editor.isActive("bold"),
//           },
//           {
//             icon: <Italic size={18} />,
//             command: () => editor.chain().focus().toggleItalic().run(),
//             active: editor.isActive("italic"),
//           },
//           {
//             icon: <Strikethrough size={18} />,
//             command: () => editor.chain().focus().toggleStrike().run(),
//             active: editor.isActive("strike"),
//           },
//           {
//             icon: <UnderlineIcon size={18} />,
//             command: () => editor.chain().focus().toggleUnderline().run(),
//             active: editor.isActive("underline"),
//           },
//         ].map(({ icon, command, active }, index) => (
//           <Button key={index} onClick={command} className={active ? "bg-gray-300" : ""}>
//             {icon}
//           </Button>
//         ))}

//         {/* Font Family Dropdown */}
//         <Select
//           defaultValue="Arial"
//           style={{ width: 120 }}
//           onChange={(value: string) => editor.chain().focus().setFontFamily(value).run()}
//           options={fontFamilies}
//         />

//         {/* Text Color Picker */}
//         <input
//           type="color"
//           onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
//         />

//         {/* Undo & Redo */}
//         <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
//           <Undo size={18} />
//         </Button>
//         <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
//           <Redo size={18} />
//         </Button>
//       </div>

//       {/* Editor Content */}
//       <EditorContent editor={editor} className="border rounded-md p-3 min-h-[200px]" />
//     </div>
//   );
// };

// export default TiptapEditor;



// "use client"; // Required for Next.js client-side rendering

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Heading from "@tiptap/extension-heading";
// import TextAlign from "@tiptap/extension-text-align";
// import TextStyle from "@tiptap/extension-text-style";

// import { Bold, Italic, Strikethrough, Underline as UnderlineIcon, List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Heading1, Heading2, Heading3 } from "lucide-react";
// import { Button } from "antd";

// const TiptapEditor = () => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       TextStyle,
//       Heading.configure({ levels: [1, 2, 3] }),
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//     ],
//     content: "<p>Hello, <strong>world!</strong></p>",
//   });

//   if (!editor) return null;

//   return (
//     <div className="border rounded-lg p-4 w-full max-w-2xl mx-auto">
//       {/* Toolbar */}
//       <div className="flex flex-wrap gap-2 mb-2 border-b pb-2">
//         <Button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "bg-gray-300" : ""}>
//           <Bold size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "bg-gray-300" : ""}>
//           <Italic size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? "bg-gray-300" : ""}>
//           <Strikethrough size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "bg-gray-300" : ""}>
//           <UnderlineIcon size={18} />
//         </Button>

//         {/* Headings */}
//         <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""}>
//           <Heading1 size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}>
//           <Heading2 size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""}>
//           <Heading3 size={18} />
//         </Button>

//         {/* Lists */}
//         <Button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "bg-gray-300" : ""}>
//           <List size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "bg-gray-300" : ""}>
//           <ListOrdered size={18} />
//         </Button>

//         {/* Blockquote & Code */}
//         <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "bg-gray-300" : ""}>
//           <Quote size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive("codeBlock") ? "bg-gray-300" : ""}>
//           <Code size={18} />
//         </Button>

//         {/* Text Alignment */}
//         <Button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""}>
//           <AlignLeft size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""}>
//           <AlignCenter size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""}>
//           <AlignRight size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={editor.isActive({ textAlign: "justify" }) ? "bg-gray-300" : ""}>
//           <AlignJustify size={18} />
//         </Button>

//         {/* Undo & Redo */}
//         <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
//           <Undo size={18} />
//         </Button>

//         <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
//           <Redo size={18} />
//         </Button>
//       </div>

//       {/* Editor Area */}
//       <EditorContent editor={editor} className="border rounded-md p-3 min-h-[200px]" />
//     </div>
//   );
// };

// export default TiptapEditor;