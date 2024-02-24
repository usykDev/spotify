document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById(
    'spotify-search-form',
  )
  const input = document.getElementById('search-input')

  input.addEventListener('input', function () {
    form.submit()
  })

  input.focus()

  input.setSelectionRange(
    input.value.length,
    input.value.length,
  )

  // alternatives for input.setSelectionRange
  //   const inputLength = input.value.length
  //   input.selectionStart = inputLength
  //   input.selectionEnd = inputLength
})
