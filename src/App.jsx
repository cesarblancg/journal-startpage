import { useEffect, useMemo } from 'react'
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Paper, Stack} from '@mui/material';

import {Journal} from './components/journal'
import {Tasks} from './components/tasks'
import {TopPanel} from "./components/top_panel"
import {SettingsPanel} from "./components/settings"
import {useTransientSettings} from "stores/transient"
import {useSettingsStore} from 'stores/settings'
import {getBrowserLocale} from 'utils'

const createCustomTheme = ({mode, primaryColor, secondaryColor, background}) =>{
  return createTheme({
    palette: {
      mode ,
      primary: {main: primaryColor},
      secondary: {main: secondaryColor},
      background: {
        paper: background,
        default: background
      }
    }
  })
}

function App() {
  const {settingsActive} = useTransientSettings()
  const {mode, primaryColor, secondaryColor, background, locale, setLocale} = useSettingsStore(state => state)
  const currentTheme = useMemo(
    () => createCustomTheme({mode, primaryColor, secondaryColor, background}),
    [mode, primaryColor, secondaryColor, background]
  )
  useEffect (
    () => {
      if (locale === null) {
        console.log("Setting default locale")
        setLocale(getBrowserLocale())
      } else {
        setLocale(locale)
      }
    },
    []
  )
  return (
    <ThemeProvider theme={currentTheme}>
      <Paper style={{minHeight: "100vh"}}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <TopPanel/>
            {
            settingsActive ?
                <SettingsPanel/>
              :
              <Stack direction="row" spacing={3}>
                <div style={{flexGrow: 0.5}}>
                  <Tasks/>
                </div>
                <div style={{flexGrow: 1}}>
                  <Journal/>
                </div>
              </Stack>
            }
          </Stack>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
