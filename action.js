chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.update({
     url: "http://progress.appacademy.io/me/jobberwocky/job_applications"
  })
})
