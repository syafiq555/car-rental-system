$(document).ready(() => {
  const api_url = 'https://car-rental-system-api.herokuapp.com'

  $('form#loginForm').submit(async event => {
    event.preventDefault()
    const button = (event.target).querySelector('button[type=submit]')

    const { password, username } = event.target.elements
    const valid = validateForm(username.value, password.value)
    if (!valid.valid)
      return alert(valid.msg)

    $(button).addClass('disabled')

    const res = await login(username.value, password.value)
    if (res.status === -1) {
      $(button).removeClass('disabled')
      return alert('User not found')
    }
    if (res.status === 0) {
      $(button).removeClass('disabled')
      return alert('Wrong password')
    }

    sessionStorage.role = res.role
    sessionStorage.token = res.token
    window.location.href = "home.html#home"
  })

  const validateForm = (username, password) => {
    if (username.length < 5 || password.length < 6) {
      return {
        msg: 'username length must be bigger than 4 and password length must be bigger than 5',
        valid: false
      }
    }

    return { valid: true }
  }

  const login = async (username, password) => {
    const res = await fetch(`${api_url}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })

    const valid = await res.json()
    return valid
  }
})