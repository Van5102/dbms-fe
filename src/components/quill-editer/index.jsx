import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuillEditer({initialValue, height, onChange }) {
  const [value, setValue] = useState(initialValue || '');

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    // [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'header': [1, 2, 3, 4, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']
  ];

  const handleSetValues = (value) => {
    setValue(value)
    onChange(value)
  }

  return (
    <ReactQuill
      className='quill-editor-customer'
      onChange={handleSetValues}
      value={value}
      theme="snow"
      modules={{ 
        toolbar: toolbarOptions 
      }}
      style={{
       
      }}
    />
  )
}

export default QuillEditer