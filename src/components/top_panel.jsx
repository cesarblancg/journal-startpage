import { useState, useEffect, memo } from 'react'
import { Typography, Stack, Box, ToggleButton } from '@mui/material';
import {Calendar} from "./calendar"
import {Bookmarks} from "./bookmarks"
import {BackgroundPaper, IconButton} from "./base"
import {SettingsIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon} from 'icons'
import {useTransientSettings} from 'stores/transient'

const dayjs = require('dayjs')

const AutoUpdatingTimePanel = () => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box sx={{padding: 2}}>
      <Typography variant="h3">{dayjs().format("LT")}</Typography>
      <Typography variant="h4">{dayjs().format("dddd LL")}</Typography>
    </Box>
  )
}


const Controls = () => {
  const {settingsActive, switchSettings, showContent, switchShowContent} = useTransientSettings()
  return (
    <Stack sx={{width: "min-content"}} direction="row">
      <ToggleButton selected={settingsActive} onChange={switchSettings}>
        <SettingsIcon />
      </ToggleButton>
      <IconButton onClick={switchShowContent} color="">
        {
          (showContent)? <KeyboardArrowUpIcon/>: <KeyboardArrowDownIcon/>
        }
      </IconButton>
    </Stack>
  )
}
export const TopPanel = memo(() => {
  return (
    <BackgroundPaper>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" justifyContent="space-between">
          <AutoUpdatingTimePanel/>
          <Controls/>
        </Stack>
        <Bookmarks/>
        <Calendar/>
      </Stack>
    </BackgroundPaper>
  )
})
