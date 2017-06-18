const executeOnAjaxComplete = cb => {
  $(document).ajaxComplete((e, xhr, options) => {
    $(e.currentTarget).unbind('ajaxComplete')
    setTimeout(cb, 0)
  })
}

const selectCompanyAndSubmit = (companyName, resolve) => {
  const $appForm = $('.me-job-app-form')
  const $dropDown = $appForm.find('#status > select')
  const $appliedOption = $appForm.find('#status > select option:contains("applied")')
  $appliedOption.prop('selected', true)

  const selectEvent = new Event('change', { bubbles: true })
  const dropDownElement = $dropDown[0]
  dropDownElement.dispatchEvent(selectEvent)

  const $submitButton = $appForm.find('button')
  $submitButton.attr('disabled', false)
  $submitButton.click()
  executeOnAjaxComplete(() => {
    resolve()
  })
}

const format = string => string.toLowerCase().replace(/ /g,'')

const fillOutForm = (companyName, resolve) => {
  const $results = $('.search-results')
  const firstResult = $results.children()[0]
  if (firstResult && firstResult.textContent && format(companyName) === format(firstResult.textContent)) {
    executeOnAjaxComplete(() => selectCompanyAndSubmit(companyName, resolve))
    firstResult.click()
  } else {
    $('figure.search > button').click()
    setTimeout(() => {
      fillOutForm(companyName, resolve)
    }, 2000)
  }
}

const createApplication = (companyName, resolve) => {
  $('.open-modal').click()
  const $search = $('.search > input')
  const searchElement = $search[0]
  $search.val(companyName)
  const inputEvent = new Event('input', { bubbles: true })
  searchElement.dispatchEvent(inputEvent)
  executeOnAjaxComplete(() => fillOutForm(companyName, resolve))
}

const singleApply = companyName => {
  return new Promise((resolve, reject) => {
    createApplication(companyName, resolve)
  }).then(() => {
    $('.easy-input').focus()
  })
}

const applyAll = (companies, idx = 0) => {
  if (idx !== companies.length) {
    const companyName = companies[idx]
    const p = singleApply(companyName)
    p.then(() => {
      setTimeout(() => {
        applyAll(companies, idx + 1)
      }, 0)
    })
  }
}

const $input = $('<input>')
$input.attr('placeholder', 'Create Application (Type company name and hit ENTER - separate multiple by commas)')
$input.addClass('easy-input')
$input.keypress((event) => {
  if (event.which == 13) {
    const names = event.currentTarget.value.split(',')
    applyAll(names)
    event.currentTarget.value = ''
  }
})

const insertEasyInput = () => {
  $('.jobberwocky-content > div').prepend($input)
}

let currentPage = window.location.href;
if (currentPage === 'http://progress.appacademy.io/me/jobberwocky/job_applications') {
  insertEasyInput()
}

setInterval(() => {
  if (currentPage != window.location.href) {
    currentPage = window.location.href;

    if (currentPage === 'http://progress.appacademy.io/me/jobberwocky/job_applications') {
      insertEasyInput()
    }
  }
}, 200)
