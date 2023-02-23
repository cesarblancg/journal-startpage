import React from 'react';

import { Typography, Divider, Checkbox, Stack } from '@mui/material';

import { EditableMarkdown } from "./editable"
import { CardList, Button, BackgroundPaper, ForegroundPaper, DeleteButton, IconButton } from "./base"
import { useSyncEntriesStore } from 'stores/sync_entries'
import { AddBoxIcon } from "icons"
const initData = {
  0: {
    lastModified: 0,
    status: "todo",
    content: `
this is a task
- with some
- items
`
  },
  1: {
    lastModified: 1,
    status: "done",
    content: `
this is done task
- with one item
`
  }
}


const Task = ({ entryKey, state, setEntry, removeEntry }) => {

  const { status, content, isDraft } = state
  const handleDelete = () => { removeEntry(entryKey) }

  const switchStatus = () => {
    const newStatus = (status === "todo") ? "done" : "todo";
    setEntry(entryKey, { ...state, status: newStatus })
  }
  const handleContentChange = (newValue) => {
    setEntry(entryKey, { ...state, content: newValue, isDraft: false })
  }
  const textColor = (status === "done") ? "text.disabled" : "text.primary";
  return (
    <ForegroundPaper sx={{ p: 1, pl: 2, color: textColor }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Checkbox sx={{ p: 0, pr: 1 }} onChange={switchStatus} checked={status === "done"} />
        </div>
        <div style={{ flex: 1, display: "flex" }}>
          <EditableMarkdown value={content} onChange={handleContentChange}
            isDraft={isDraft} handleCancelDraft={handleDelete}
            textFieldProps={{ placeholder: "To do" }}
          />
        </div>
        <DeleteButton onClick={handleDelete} />
      </Stack>
    </ForegroundPaper>
  )
}

const extractTasks = (entries) => {
  const todo = []
  const done = []
  for (const [key, entry] of Object.entries(entries)) {
    if (entry === null) { continue }
    if (entry.deleted) { continue }
    if (entry.status === "todo") { todo.push([key, entry]) }
    else { done.push([key, entry]) }
  }
  return { todo, done }
}

export const TasksList = ({ title, entries, setEntry, removeEntry }) => {
  if (Object.keys(entries).length === 0) {
    return null
  }
  return (

    <div>
      <Typography variant="h5">{title}</Typography>
      <CardList>
        {
          entries.map(([key, entry]) => <Task key={key} entryKey={key}
            setEntry={setEntry}
            removeEntry={removeEntry}
            state={entry}

          />)
        }
      </CardList>
    </div>
  )
}

export const Tasks = () => {

  const { entries, setEntry, addEntry, removeEntry } = useSyncEntriesStore(
    {
      name: "tasks",
      initData
    })

  const addEmptyTask = () => addEntry({ status: "todo", content: "", isDraft: true })
  const { todo, done } = extractTasks(entries)
  return (

    <BackgroundPaper>
      <Stack spacing={1}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h3" component="h1">Tasks</Typography>
          <IconButton onClick={addEmptyTask}><AddBoxIcon/></IconButton>
        </Stack>
        <Divider />
        <TasksList title={"Todo"} entries={todo} setEntry={setEntry} removeEntry={removeEntry} />
        <TasksList title={"Done"} entries={done} setEntry={setEntry} removeEntry={removeEntry} />
      </Stack>
    </BackgroundPaper>
  )
}

