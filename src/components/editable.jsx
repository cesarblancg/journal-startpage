import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import {Link,  TextField, Table, TableBody, TableCell, TableHead, TableRow, TableContainer} from '@mui/material';
import remarkGfm from 'remark-gfm'
import {makeLogger} from 'utils'
const log = makeLogger("EditableComp")

const useEditableState = (initial, onChange, isDraft) => {
  const [active, setActive] = useState(isDraft)
  const [curValue, setCurValue] = useState(initial)

  /* update curValue if the initial value was changed externally */
  useEffect(
    () => {
        setCurValue(initial)
    },
    [initial]
  )
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

export const EditableInput = ({
    value, onChange, Component, componentProps, textFieldProps,
    isDraft, handleCancelDraft, placeholder
}) => {
  const {curValue, active, handleChange, commitChange, cancelChange, handleClick} = useEditableState(
    value, onChange, isDraft)
  const handleKeyPress = (event) => {
    if (event.code === "Enter" && event.ctrlKey) {
      commitChange()
    }
  }
  const handleKeyUp = (event) => {
    if (event.code === "Escape") {
      if (isDraft) {
        handleCancelDraft()
      } else {
        cancelChange()
      }
    }
  }
  if (active) {
    return <TextField type="text"
                      value={curValue}
                      onChange={handleChange}
                      onBlur={commitChange}
                      autoFocus
                      variant="standard"
                      onKeyPress={handleKeyPress}
                      onKeyUp={handleKeyUp}
                      fullWidth
                      {...textFieldProps}
           />
  } else {
    return <Component {...componentProps} onDoubleClick={handleClick}>{value}</Component>
  }
}

const mdComponents = {
  a:  (node, ...props) => <Link href={node.href} target="_blank">{node.children}</Link>,
  table: (node, ...props) => <Table sx={{width: "auto"}}>{node.children}</Table>,
  thead: (node, ...props) => <TableHead sx={{"& th": {fontSize: "1.25rem"},borderBottom: "2px solid black"}}>{node.children}</TableHead>,
  tbody: (node, ...props) => <TableBody>{node.children}</TableBody>,
  tr: (node, ...props) => <TableRow>{node.children}</TableRow>,
  td: (node, ...props) => <TableCell>{node.children}</TableCell>,
  th: (node, ...props) => <TableCell>{node.children}</TableCell>,
}



export const EditableMarkdown = (props) => {
    const Component = ({children, onDoubleClick}) => (
        <div
          onDoubleClick={onDoubleClick}
            style={{ flexGrow: 1 }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={mdComponents}
            >{children}</ReactMarkdown>
        </div>
    )
    return <EditableInput {...props} textFieldProps={{multiline: true, ...props.textFieldProps}} Component={Component}/>
}
