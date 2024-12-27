import React, { useRef, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

interface ProductDescriptionProps {
  long_description: string;
}

export default function ProductDescription({
  long_description,
}: ProductDescriptionProps) {
  return (
    <div className="sun-editor-container">
      <SunEditor
        disable={true}
        hideToolbar={true}
        setContents={long_description}
        setDefaultStyle="font-family: 'Roboto','Helvetica','Arial',sans-serif; font-size:14px;"
        setOptions={{
          height: "100%",
        }}
      />
    </div>
  );
}
