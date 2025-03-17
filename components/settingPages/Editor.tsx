"use client";

import React, {useState} from "react";
import CkEditor from "../ckEditor/CKEditor";

const Editor: React.FC = () => {
  const [editorData, setEditorData] = useState<string>("");
  const [data, setData] = useState<string>("");

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      console.log("Editor data field:", editor);
      setData(editor);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <CkEditor
        editorData={editorData}
        setEditorData={setEditorData}
        handleOnUpdate={handleOnUpdate}
      />
    </div>
  );
};

export default Editor;