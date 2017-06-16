const executeOnAjaxComplete = cb => {
  $(document).on('DOMNodeInserted', () => {
    console.log('triggered');
    $(document).unbind('DOMNodeInserted')
    setTimeout(cb, 0)
  })
  // $(document).ajaxComplete((e, xhr, options) => {
  //   console.log('triggered');
  //   $(e.currentTarget).unbind('ajaxComplete')
  //   setTimeout(cb, 0)
  // })
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
  executeOnAjaxComplete(() => resolve())
}

const fillOutForm = (companyName, resolve) => {
  const $results = $('.search-results')
  const firstResult = $results.children()[0]
  if (firstResult && firstResult.textContent && companyName.toLowerCase() === firstResult.textContent.toLowerCase()) {
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

const companies = [
  'FieldVision',
  'Indie Money',
  'x.ai',
]

const singleApply = companyName => {
  return new Promise((resolve, reject) => {
    createApplication(companyName, resolve)
  })
}

const applyAll = (idx = 0) => {
  if (idx !== companies.length) {
    const companyName = companies[idx]
    const p = singleApply(companyName)
    p.then(() => {
      setTimeout(() => {
        applyAll(idx + 1)
      }, 0)
    })
  }
}

// applyAll()
// singleApply('x.ai')

const $input = $('<input>')
$input.keypress((event) => {
  if (event.which == 13) {
    singleApply(event.currentTarget.value)
    event.currentTarget.value = ''
  }
})
$('.jobberwocky-content > div').prepend($input)
