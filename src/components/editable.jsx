import React, {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {Link,  TextField} from '@mui/material';

const useEditableState = (initial, onChange) => {
  const [active, setActive] = useState(false)
  const [curValue, setCurValue] = useState(initial)

  const handleChange = (event) => {
    setCurValue(event.target.value)
  }
  const commitChange = () => {
    setActive(false);
    onChange(curValue);
  }

  const handleClick = () => {
    setActive(true);
  }
  const cancelChange = () => {
    setCurValue(initial);
    setActive(false);
  }
  return {curValue, active, handleChange, commitChange, cancelChange, handleClick}
}

export const EditableInput = ({value, onChange}) => {
  const {curValue, active, handleChange, commitChange, handleClick} = useEditableState(value, onChange)
  if (active) {
    return <input type="text"
                  value={curValue}
                  onChange={handleChange}
                  onBlur={commitChange}
                  autoFocus
           />
  } else {
    return <div onClick={handleClick}><span>{value}</span></div>
  }
}

const mdComponents = {
  a:  (node, ...props) => {
    return (
      <Link href={node.href} target="_blank">{node.children}</Link>
    )
  }
}

export const EditableMarkdown = ({value, onChange}) => {
  const {curValue, active, handleChange, commitChange, cancelChange, handleClick} = useEditableState(value, onChange)

  const handleKeyPress = (event) => {
    if (event.code === "Enter" && event.ctrlKey) {
      commitChange()
    }
  }
  const handleKeyUp = (event) => {
    if (event.code === "Escape") {
      cancelChange()
    }
  }
  if (active) {
    return <TextField
             sx={{width: "100%"}}
             value={curValue}
             onChange={handleChange}
             onBlur={commitChange}
             autoFocus
             onKeyPress={handleKeyPress}
             onKeyUp={handleKeyUp}
             multiline
           />
  } else {
    return (
      <div
        onDoubleClick={handleClick}
        style={{flexGrow: 1}}
      >
        <ReactMarkdown
          components={mdComponents}
        >{value}</ReactMarkdown>
      </div>)
  }
}

