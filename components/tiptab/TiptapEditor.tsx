"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import interact from "interactjs";
import { useEffect, useState, useRef } from "react";
import { SketchPicker } from "react-color";
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
  List,
  ListOrdered,
  Quote,
  Trash,
} from "lucide-react";
import { Button, Select, Tooltip, Input } from "antd";
import "./style.css";

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
  { label: "Qahiri", value: "Qahiri" },
  { label: "Amiri", value: "Amiri" },
];

// Font Size Options
const fontSizes = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
];

// Image Size Options
const imageSizes = [
  { label: "Small", value: "150px" },
  { label: "Medium", value: "300px" },
  { label: "Large", value: "450px" },
  { label: "Custom", value: "custom" },
];

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  key: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, placeholder, key }) => {
  const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "resizable-image",
        },
      }),
      Placeholder.configure({ placeholder: placeholder || "Write something..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    const handleImageClick = (event: MouseEvent) => {
      if (
        event.target instanceof HTMLImageElement &&
        !(event.target as HTMLElement).closest(".image-toolbar")
      ) {
        setSelectedImage(event.target);
      } else if (!(event.target as HTMLElement).closest(".image-toolbar")) {
        setSelectedImage(null);
      }
    };

    document.addEventListener("click", handleImageClick);
    return () => document.removeEventListener("click", handleImageClick);
  }, []);

  useEffect(() => {
    const editorContainer = editorContainerRef.current;
    if (!editorContainer) return;

    interact(editorContainer).resizable({
      edges: { bottom: true },
      listeners: {
        move(event) {
          const newHeight = event.rect.height;
          editorContainer.style.height = `${newHeight}px`;
        },
      },
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
    editor.chain().focus().setColor(color.hex).run();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        editor.chain().focus().setImage({ src: base64Image }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const alignImage = (alignment: "left" | "center" | "right") => {
    if (selectedImage) {
      selectedImage.style.float = alignment === "center" ? "none" : alignment;
      selectedImage.style.display = alignment === "center" ? "block" : "inline-block";
      selectedImage.style.marginLeft = alignment === "center" ? "auto" : "0";
      selectedImage.style.marginRight = alignment === "center" ? "auto" : "0";
    }
  };

  const removeImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
    }
  };

  const handleImageSizeChange = (size: string) => {
    if (selectedImage) {
      if (size === "custom") {
        const customSize = prompt("Enter custom size (e.g., 200px or 50%):");
        if (customSize) {
          selectedImage.style.width = customSize;
          selectedImage.style.height = "auto";
        }
      } else {
        selectedImage.style.width = size;
        selectedImage.style.height = "auto";
      }
    }
  };

  return (
    <div className="p-4 w-[95%] mx-auto" key={key}>
      <div className="flex flex-wrap gap-2 mb-2">
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

        {/* Custom Color Picker */}
        <Tooltip title="Text Color">
          <div style={{ position: "relative" }} ref={colorPickerRef}>
            <Button
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{ backgroundColor: selectedColor, width: 40, height: 32 }}
            />
            {showColorPicker && (
              <div style={{ position: "absolute", zIndex: 1000 }}>
                <SketchPicker color={selectedColor} onChange={handleColorChange} />
              </div>
            )}
          </div>
        </Tooltip>

        {/* Insert Image Button */}
        <Tooltip title="Insert Image">
          <Button onClick={() => document.getElementById("image-upload")?.click()}>
            <ImageIcon size={18} />
          </Button>
        </Tooltip>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />

        {/* Bullet List Button */}
        <Tooltip title="Bullet List">
          <Button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "bg-gray-300" : ""}>
            <List size={18} />
          </Button>
        </Tooltip>

        {/* Numbered List Button */}
        <Tooltip title="Numbered List">
          <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "bg-gray-300" : ""}>
            <ListOrdered size={18} />
          </Button>
        </Tooltip>

        {/* Blockquote Button */}
        <Tooltip title="Blockquote">
          <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "bg-gray-300" : ""}>
            <Quote size={18} />
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
      </div>

      {/* Image Toolbar */}
      {selectedImage && (
        <div className="image-toolbar flex gap-2 mb-2">
          <Tooltip title="Align Left">
            <Button onClick={() => alignImage("left")}>
              <AlignLeft size={18} />
            </Button>
          </Tooltip>
          <Tooltip title="Align Center">
            <Button onClick={() => alignImage("center")}>
              <AlignCenter size={18} />
            </Button>
          </Tooltip>
          <Tooltip title="Align Right">
            <Button onClick={() => alignImage("right")}>
              <AlignRight size={18} />
            </Button>
          </Tooltip>
          <Tooltip title="Remove Image">
            <Button onClick={removeImage}>
              <Trash size={18} />
            </Button>
          </Tooltip>
          <Select
            defaultValue="Medium"
            style={{ width: 120 }}
            onChange={(value: string) => handleImageSizeChange(value)}
            options={imageSizes}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Editor Content */}
      <div
        ref={editorContainerRef}
        className="editor-container border rounded-md p-3 relative"
        style={{ height: 300 }}
      >
        <EditorContent editor={editor} />
        <div className="resize-handle"></div>
      </div>
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
// import Image from "@tiptap/extension-image";
// import Placeholder from "@tiptap/extension-placeholder";
// import interact from "interactjs";
// import { useEffect, useState, useRef } from "react";
// import { SketchPicker } from "react-color";
// import {
//   Bold,
//   Italic,
//   Strikethrough,
//   Underline as UnderlineIcon,
//   Undo,
//   Redo,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Image as ImageIcon,
//   List,
//   ListOrdered,
//   Quote,
//   Trash,
// } from "lucide-react";
// import { Button, Select, Tooltip, Input } from "antd";
// import "./style.css";

// // Extend Tiptap Commands for Font Family and Font Size
// declare module "@tiptap/core" {
//   interface Commands<ReturnType> {
//     setFontFamily: {
//       setFontFamily: (fontFamily: string) => ReturnType;
//       unsetFontFamily: () => ReturnType;
//     };
//     setFontSize: {
//       setFontSize: (fontSize: string) => ReturnType;
//       unsetFontSize: () => ReturnType;
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
//             parseHTML: (element) => element.style.fontFamily?.replace(/['"]+/g, ""),
//             renderHTML: (attributes) =>
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
//           ({ chain }) =>
//             chain().setMark("textStyle", { fontFamily }).run(),
//       unsetFontFamily:
//         () =>
//           ({ chain }) =>
//             chain().setMark("textStyle", { fontFamily: null }).removeEmptyTextStyle().run(),
//     };
//   },
// });

// // Font Size Extension
// const FontSize = Extension.create({
//   name: "fontSize",
//   addGlobalAttributes() {
//     return [
//       {
//         types: ["textStyle"],
//         attributes: {
//           fontSize: {
//             default: null,
//             parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ""),
//             renderHTML: (attributes) =>
//               attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
//           },
//         },
//       },
//     ];
//   },
//   addCommands() {
//     return {
//       setFontSize:
//         (fontSize: string) =>
//           ({ chain }) =>
//             chain().setMark("textStyle", { fontSize }).run(),
//       unsetFontSize:
//         () =>
//           ({ chain }) =>
//             chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
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
//   { label: "Qahiri", value: "Qahiri" },
//   { label: "Amiri", value: "Amiri" },
// ];

// // Font Size Options
// const fontSizes = [
//   { label: "12px", value: "12px" },
//   { label: "14px", value: "14px" },
//   { label: "16px", value: "16px" },
//   { label: "18px", value: "18px" },
//   { label: "20px", value: "20px" },
//   { label: "24px", value: "24px" },
//   { label: "28px", value: "28px" },
//   { label: "32px", value: "32px" },
// ];

// // Image Size Options
// const imageSizes = [
//   { label: "Small", value: "150px" },
//   { label: "Medium", value: "300px" },
//   { label: "Large", value: "450px" },
//   { label: "Custom", value: "custom" },
// ];

// interface TiptapEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
//   const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null);
//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [selectedColor, setSelectedColor] = useState("#000000");
//   const editorContainerRef = useRef<HTMLDivElement>(null);
//   const colorPickerRef = useRef<HTMLDivElement>(null);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       TextStyle,
//       Color,
//       FontFamily,
//       FontSize,
//       Heading.configure({ levels: [1, 2, 3] }),
//       TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
//       Image.configure({
//         inline: true,
//         allowBase64: true,
//         HTMLAttributes: {
//           class: "resizable-image",
//         },
//       }),
//       Placeholder.configure({ placeholder: "Write something..." }),
//     ],
//     content: value,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   useEffect(() => {
//     const handleImageClick = (event: MouseEvent) => {
//       if (
//         event.target instanceof HTMLImageElement &&
//         !(event.target as HTMLElement).closest(".image-toolbar")
//       ) {
//         setSelectedImage(event.target);
//       } else if (!(event.target as HTMLElement).closest(".image-toolbar")) {
//         setSelectedImage(null);
//       }
//     };

//     document.addEventListener("click", handleImageClick);
//     return () => document.removeEventListener("click", handleImageClick);
//   }, []);

//   useEffect(() => {
//     const editorContainer = editorContainerRef.current;
//     if (!editorContainer) return;

//     interact(editorContainer).resizable({
//       edges: { bottom: true },
//       listeners: {
//         move(event) {
//           const newHeight = event.rect.height;
//           editorContainer.style.height = `${newHeight}px`;
//         },
//       },
//     });
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
//         setShowColorPicker(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (!editor) return null;

//   const handleColorChange = (color: any) => {
//     setSelectedColor(color.hex);
//     editor.chain().focus().setColor(color.hex).run();
//   };

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const base64Image = e.target?.result as string;
//         editor.chain().focus().setImage({ src: base64Image }).run();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const alignImage = (alignment: "left" | "center" | "right") => {
//     if (selectedImage) {
//       selectedImage.style.float = alignment === "center" ? "none" : alignment;
//       selectedImage.style.display = alignment === "center" ? "block" : "inline-block";
//       selectedImage.style.marginLeft = alignment === "center" ? "auto" : "0";
//       selectedImage.style.marginRight = alignment === "center" ? "auto" : "0";
//     }
//   };

//   const removeImage = () => {
//     if (selectedImage) {
//       selectedImage.remove();
//       setSelectedImage(null);
//     }
//   };

//   const handleImageSizeChange = (size: string) => {
//     if (selectedImage) {
//       if (size === "custom") {
//         const customSize = prompt("Enter custom size (e.g., 200px or 50%):");
//         if (customSize) {
//           selectedImage.style.width = customSize;
//           selectedImage.style.height = "auto";
//         }
//       } else {
//         selectedImage.style.width = size;
//         selectedImage.style.height = "auto";
//       }
//     }
//   };

//   return (
//     <div className="p-4 w-[95%] mx-auto">
//       <div className="flex flex-wrap gap-2 mb-2">
//         {/* Font Family Dropdown */}
//         <Select
//           defaultValue="Arial"
//           style={{ width: 120 }}
//           onChange={(value: string) => editor.chain().focus().setFontFamily(value).run()}
//           options={fontFamilies}
//         />

//         {/* Font Size Dropdown */}
//         <Select
//           defaultValue="16px"
//           style={{ width: 100 }}
//           onChange={(value: string) => editor.chain().focus().setFontSize(value).run()}
//           options={fontSizes}
//         />

//         {/* Text Formatting Buttons */}
//         {[
//           { icon: <Bold size={18} />, command: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
//           { icon: <Italic size={18} />, command: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
//           { icon: <Strikethrough size={18} />, command: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), title: "Strikethrough" },
//           { icon: <UnderlineIcon size={18} />, command: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), title: "Underline" },
//         ].map(({ icon, command, active, title }, index) => (
//           <Tooltip key={index} title={title}>
//             <Button onClick={command} className={active ? "bg-gray-300" : ""}>
//               {icon}
//             </Button>
//           </Tooltip>
//         ))}

//         {/* Text Alignment Buttons */}
//         {[
//           { icon: <AlignLeft size={18} />, command: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }), title: "Align Left" },
//           { icon: <AlignCenter size={18} />, command: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }), title: "Align Center" },
//           { icon: <AlignRight size={18} />, command: () => editor.chain().focus().setTextAlign("right").run(), active: editor.isActive({ textAlign: "right" }), title: "Align Right" },
//           { icon: <AlignJustify size={18} />, command: () => editor.chain().focus().setTextAlign("justify").run(), active: editor.isActive({ textAlign: "justify" }), title: "Justify" },
//         ].map(({ icon, command, active, title }, index) => (
//           <Tooltip key={index} title={title}>
//             <Button onClick={command} className={active ? "bg-gray-300" : ""}>
//               {icon}
//             </Button>
//           </Tooltip>
//         ))}

//         {/* Custom Color Picker */}
//         <Tooltip title="Text Color">
//           <div style={{ position: "relative" }} ref={colorPickerRef}>
//             <Button
//               onClick={() => setShowColorPicker(!showColorPicker)}
//               style={{ backgroundColor: selectedColor, width: 40, height: 32 }}
//             />
//             {showColorPicker && (
//               <div style={{ position: "absolute", zIndex: 1000 }}>
//                 <SketchPicker color={selectedColor} onChange={handleColorChange} />
//               </div>
//             )}
//           </div>
//         </Tooltip>

//         {/* Insert Image Button */}
//         <Tooltip title="Insert Image">
//           <Button onClick={() => document.getElementById("image-upload")?.click()}>
//             <ImageIcon size={18} />
//           </Button>
//         </Tooltip>
//         <input
//           id="image-upload"
//           type="file"
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={handleImageUpload}
//         />

//         {/* Bullet List Button */}
//         <Tooltip title="Bullet List">
//           <Button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "bg-gray-300" : ""}>
//             <List size={18} />
//           </Button>
//         </Tooltip>

//         {/* Numbered List Button */}
//         <Tooltip title="Numbered List">
//           <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "bg-gray-300" : ""}>
//             <ListOrdered size={18} />
//           </Button>
//         </Tooltip>

//         {/* Blockquote Button */}
//         <Tooltip title="Blockquote">
//           <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "bg-gray-300" : ""}>
//             <Quote size={18} />
//           </Button>
//         </Tooltip>

//         {/* Undo & Redo */}
//         <Tooltip title="Undo">
//           <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
//             <Undo size={18} />
//           </Button>
//         </Tooltip>
//         <Tooltip title="Redo">
//           <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
//             <Redo size={18} />
//           </Button>
//         </Tooltip>
//       </div>

//       {/* Image Toolbar */}
//       {selectedImage && (
//         <div className="image-toolbar flex gap-2 mb-2">
//           <Tooltip title="Align Left">
//             <Button onClick={() => alignImage("left")}>
//               <AlignLeft size={18} />
//             </Button>
//           </Tooltip>
//           <Tooltip title="Align Center">
//             <Button onClick={() => alignImage("center")}>
//               <AlignCenter size={18} />
//             </Button>
//           </Tooltip>
//           <Tooltip title="Align Right">
//             <Button onClick={() => alignImage("right")}>
//               <AlignRight size={18} />
//             </Button>
//           </Tooltip>
//           <Tooltip title="Remove Image">
//             <Button onClick={removeImage}>
//               <Trash size={18} />
//             </Button>
//           </Tooltip>
//           <Select
//             defaultValue="Medium"
//             style={{ width: 120 }}
//             onChange={(value: string) => handleImageSizeChange(value)}
//             options={imageSizes}
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}

//       {/* Editor Content */}
//       <div
//         ref={editorContainerRef}
//         className="editor-container border rounded-md p-3 relative"
//         style={{ height: 300 }}
//       >
//         <EditorContent editor={editor} />
//         <div className="resize-handle"></div>
//       </div>
//     </div>
//   );
// };

// export default TiptapEditor;