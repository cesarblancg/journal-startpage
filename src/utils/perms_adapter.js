const getPermissionssApi = () => {
  if (process.env.REACT_APP_MOCK_BROWSER_APIS === "true") {
    return {
      request: async () => {}
    }
  } else  if (navigator.userAgent.match(/chrome|chromium|crios/i)){
    /* eslint-disable */
    return chrome.permissions
    /* eslint-enable */
  } else if (navigator.userAgent.match(/firefox|fxios/i)){
    /* eslint-disable */
    return browser.permissions
    /* eslint-enable */
  }
}

export const permissionsAPI = getPermissionssApi()
