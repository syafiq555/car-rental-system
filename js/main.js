function logout() {
  sessionStorage.clear()
  window.location.reload()
}

async function submitOrder() {
  const dateFrom = document.querySelector('input[name=dateFrom]')
  const dateTo = document.querySelector('input[name=dateTo]')
  const timeFrom = document.querySelector('input[name=timeFrom]')
  const timeTo = document.querySelector('input[name=timeTo]')

  if (dateFrom && dateTo && timeFrom && timeTo) {
    const fromJs = new Date(`${dateTo.value} ${timeTo.value}:00`)
    const to = moment(fromJs, 'YYYY-MM-DD HH:mm:ss')
    const toJs = new Date(`${dateFrom.value} ${timeFrom.value}:00`)
    const from = moment(toJs, 'YYYY-MM-DD HH:mm:ss')
    const hours = calculateHours(to, from)
    window.location.href = `home.html#all_car_list/${hours}/${from.format('YYYY-MM-DD HH:mm:ss')}/${to.format('YYYY-MM-DD HH:mm:ss')}`
  }
}

const calculateHours = (to, from) => moment.duration(to.diff(from)).asHours()

$(function () {
  const api_url = 'https://car-rental-system-api.herokuapp.com'
  if (sessionStorage.token) {
    $('.unauthorized').hide()
    $('.authorized').show()
  } else {
    $('.unauthorized').show()
    $('.authorized').hide()
  }
  if (sessionStorage.getItem('role') !== 'admin')
    $('.admin').hide()
  else
    $('.no_admin').hide()

  function parseHash(newHash, oldHash) {
    crossroads.parse(newHash);
  }

  Handlebars.registerHelper('displayApproval', (approved) => {
    if (approved === 0)
      return `<div class="widget yellow-bg p-lg text-center">
      <div class="m-b-md">
        <i class="fas fa-undo fa-4x"></i>
        <h1 class="font-bold m-xs">Pending</h1>
      </div>
    </div>`
    else if (approved === 1)
      return ` <div class="widget text-white p-lg text-center" style="background:green">
    <div class="m-b-md">
      <i class="fas fa-check fa-4x"></i>
      <h1 class="font-bold m-xs">Approve</h1>
    </div>
  </div>`
    else
      return `<div class="widget red-bg p-lg text-center">
    <div class="m-b-md">
      <i class="fas fa-times fa-4x"></i>
      <h1 class="font-bold m-xs">Reject</h1>
    </div>
  </div>`
  })

  // Handlebars.registerHelper("fullname", function (fname, lname) {
  //   return fname + " " + lname;
  // });

  // Handlebars.registerHelper("displaystatus", function (status) {
  //   var thestatus = parseInt(status);
  //   if (thestatus === 0)
  //     return "<span style='color: red; font-weight: bold'>not active</span>";
  //   else if (thestatus === 1)
  //     return "<span style='color: green; font-weight: bold'>active</span>";
  // });

  const toggleNavbar = route => {
    if (window.innerWidth <= 991) {
      const navigation = document.querySelector('ul.nav.navbar-nav.mr-auto')
      const lia = navigation.querySelectorAll('li a')
      lia.forEach(link => {
        $(link).parent().removeClass('active')
        if ($(link).attr('href') === `#${route}`) {
          $(link).parent().addClass('active')
          if ($(link).parent().parent().hasClass('dropdown-menu')) {
            $(link).parent().parent().parent().addClass('active')
          }
        }
        if (!$(link).hasClass('dropdown-toggle'))
          $(link).click(() => document.querySelector('nav button.navbar-toggler').click())
      })
    }
  }

  crossroads.addRoute('/home', function () {
    var homeTemplate = Handlebars.templates['home'];

    var context = { page_title: 'Home Page' };
    var htmlTemplate = homeTemplate(context);

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'home'
    toggleNavbar(route)
  });

  crossroads.addRoute('/search_car_result', function () {
    var searchCarResult = Handlebars.templates['searchCarResult'];

    var htmlTemplate = searchCarResult();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'search_car_result'
    toggleNavbar(route)
  });

  //Add New Car
  crossroads.addRoute('/manage_car', async function () {
    if (!sessionStorage.token) {
      Swal.fire('Ooupss..', 'You don\'t have permission to view this action, please re-login as admin', 'error')
      setTimeout(() => window.location.href = 'login.html', 2000)
    }
    var manageCar = Handlebars.templates['manageCar'];
    const resModels = await fetch(`${api_url}/get_all_models`, {
      headers: {
        'Authorization': `bearer ${sessionStorage.getItem('token')}`
      }
    })

    const resCars = await fetch(`${api_url}/get_all_cars`)

    const [models, cars] = await Promise.all([resModels.json(), resCars.json()])
    const context = {
      models, cars
    }

    var htmlTemplate = manageCar(context);

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'manage_car'
    toggleNavbar(route)
    addClassToDatatable('carsTable')
    const collapsedLink = document.querySelector('div.ibox-tools a.collapse-link')
    const clickEvent = collapsedLink.addEventListener('click', function () {
      const parent = $(this).parent().parent().parent()
      if (!parent.hasClass('collapsed'))
        parent.addClass('collapsed')
      else
        parent.removeClass('collapsed')
      document.removeEventListener('click', clickEvent)
    })

    const form = $('form#manageCarForm')
    form.submit(async e => {
      e.preventDefault()
      const createCarRes = await submitCar(e.target.elements)
      if (!createCarRes.status)
        return Swal.fire('Ouupss..', createCarRes.error, 'error')
      Swal.fire('Insertion Successful', 'Car successfully inserted in database', 'success')
      setTimeout(() => window.location.href = 'home.html#all_car_list', 1000)
    })
  });

  const submitCar = async car => {
    const { year, plate_number, price_per_hour, model_id } = car
    const res = await fetch(`${api_url}/create_car`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        year: year.value.trim(),
        plate_number: plate_number.value.trim().toLowerCase(),
        price_per_hour: price_per_hour.value.trim(),
        model_id: model_id.value.trim(),
      })
    })
    return await res.json()
  }

  //Add Manufacture
  crossroads.addRoute('/add_manufacture', async function () {
    if (!sessionStorage.token) {
      Swal.fire('Ooupss..', 'You don\'t have permission to view this action, please re-login as admin', 'error')
      setTimeout(() => window.location.href = 'login.html', 2000)
    }
    var addManufacture = Handlebars.templates['addmanufacture'];

    const manufacturers = await fetchManufacturers()

    const context = {
      manufacturers
    }
    var htmlTemplate = addManufacture(context);

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);

    const route = 'add_manufacture'
    toggleNavbar(route)
    addClassToDatatable('modelTable')

    $('form#manufacturerForm').submit(async e => {
      e.preventDefault()
      const { manufacturer_name } = e.target.elements
      const submittedManufacturer = await submitManufacturer(manufacturer_name)
      if (!submittedManufacturer.status)
        return Swal.fire('Oouupss...', submittedManufacturer.error, 'error')
      Swal.fire('Insertion Successful', 'success')
      if (submittedManufacturer) {
        window.location.href = 'home.html#manage_car'
      }
    })
  });

  const submitManufacturer = async manufacturer_name => {
    const submittedManufacturer = await fetch(`${api_url}/create_manufacturer`, {
      headers: {
        'Authorization': `bearer ${sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({
        manufacturer_name: manufacturer_name.value.trim().toLowerCase()
      })
    })

    return await submittedManufacturer.json()
  }

  const fetchManufacturers = async () => {
    const res = await fetch(`${api_url}/get_all_manufacturers`, {
      headers: {
        'Authorization': `bearer ${sessionStorage.getItem('token')}`
      }
    })

    return await res.json()
  }

  const addClassToDatatable = name => {
    $(`table#${name}`).dataTable()
    $(`#${name}_filter`).addClass('form-inline')
    $(`div#${name}_length`).addClass('form-inline')
    $(`select[name=${name}_length]`).addClass('form-control mx-2')
    $(`#${name}_filter label input`).addClass('form-control form-control-sm').attr('placeholder', 'Model name or id')
  }

  crossroads.addRoute('/add_model', async function () {
    if (!sessionStorage.token) {
      Swal.fire('Ooupss', 'This page is only for admin', 'error')
      setTimeout(() => window.location.href = 'index.html', 1000)
    }

    var addModel = Handlebars.templates['addmodel'];

    const modelRes = await fetch(`${api_url}/get_all_models`, {
      headers: {
        'Authorization': `bearer ${sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    const manufacturerRes = await fetch(`${api_url}/get_all_manufacturers`, {
      headers: {
        'Authorization': `bearer ${sessionStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    const [models, manufacturers] = await Promise.all([modelRes.json(), manufacturerRes.json()])

    const context = {
      models, manufacturers
    }

    var htmlTemplate = addModel(context);

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'add_model'
    toggleNavbar(route)
    addClassToDatatable('modelTable')
    const form = document.forms.createModelForm
    $('button#cancel').click(e => {
      form.reset()
      e.preventDefault()
    })

    $(form).submit(async e => {
      e.preventDefault()
      const res = await fetch(`${api_url}/create_model`, {
        method: 'post',
        headers: {
          'Authorization': `bearer ${sessionStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_name: e.target.elements.model_name.value.trim().toLowerCase(),
          manufacturer_id: e.target.elements.manufacturer_id.value
        })
      })
      const submitted = await res.json()
      if (submitted.error !== 'none')
        return Swal.fire('Ooupss', submitted.error, 'error')
      Swal.fire('Insertion successful!', `${e.target.elements.model_name.value.trim().toLowerCase()} already been inserted into the datase`, 'success')
      if (submitted)
        setTimeout(() => window.location.reload(), 1000)
    })
  });

  //Approval List
  crossroads.addRoute('/approval_list', function () {
    var approvalList = Handlebars.templates['approvalList'];

    var htmlTemplate = approvalList();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'approval_list'
    toggleNavbar(route)
  });

  crossroads.addRoute('/all_car_list/:hour:/:from:/:to:', async function (hour, from, to) {
    var allCarList = Handlebars.templates['allCarList'];
    const res = await fetch(`${api_url}/get_all_cars`)
    const cars = await res.json()

    const context = {
      cars
    }
    var htmlTemplate = allCarList(context);

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'all_car_list'
    toggleNavbar(route)
  });

  crossroads.addRoute('/customer_booking_status', function () {
    var cust_booking_status = Handlebars.templates['customerBookingStatus'];

    var htmlTemplate = cust_booking_status();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'customer_booking_status'
    toggleNavbar(route)
  });

  hasher.initialized.add(parseHash); //parse initial hash
  hasher.changed.add(parseHash); //parse hash changes
  hasher.init(); //start listening for history change

});