const form = $('form#registerForm');
const api_url = 'https://car-rental-system-api.herokuapp.com'

form.submit(async e => {
  e.preventDefault()
  const submitButton = $('button[type=submit]')
  submitButton.fadeOut(1000).hide()

  const isValid = validateInputs(e.target.elements)
  if (!isValid.valid) {
    submitButton.fadeIn(1000).show()
    return Swal.fire('Ooupss...', isValid.message, 'error')
  }

  const registration = await registerUser(e.target.elements)
  if (!registration.insertstatus) {
    console.log(registration)
    submitButton.fadeIn(1000).show()
    return Swal.fire('Ouupss..', registration.error, 'error')
  }

  Swal.fire('Registration Successful', 'Welcome to you only car rental system', 'success')
  setTimeout(() => window.location.href = 'login.html', 3000)
})

const validateInputs = data => {
  if (data.username.value.trim().length < 4)
    return { valid: false, message: 'Username must be bigger than 4' }
  if (data.password.value.length < 5)
    return { valid: false, message: 'Password must be bigger than 4' }
  if (data.password.value !== data.repeatPassword.value)
    return { valid: false, message: 'password must be the same' }
  if (data.ic_number.value.trim().length < 12)
    return { valid: false, message: 'ic number must be bigger than 11' }
  return { valid: true }
}

const registerUser = async data => {
  const { username, password, email, ic_number, mobile_phone, first_name, last_name } = data
  const res = await fetch(`${api_url}/registration`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({
      username: username.value.trim().toLowerCase(),
      password: password.value,
      email: email.value.trim().toLowerCase(),
      ic_number: ic_number.value.trim(),
      mobile_phone: mobile_phone.value.trim(),
      first_name: first_name.value.trim().toLowerCase(),
      last_name: last_name.value.trim().toLowerCase()
    })
  })

  const registrationData = await res.json()
  return registrationData
}

