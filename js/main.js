function logout() {
  sessionStorage.clear()
  window.location.reload()
}

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
    if ($(document.body).hasClass('body-small')) {
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

  crossroads.addRoute('/manage_car', async function () {
    if (!sessionStorage.token) {
      Swal.fire('Ooupss..', 'You don\'t have permission to view this action, please re-login as admin', 'error')
      setTimeout(() => window.location.href = 'login.html', 2000)
    }
    var manageCar = Handlebars.templates['manageCar'];
    const res = await fetch(`${api_url}/get_all_models`, {
      headers: {
        'Authorization': `bearer ${sessionStorage.getItem('token')}`
      }
    })

    const models = await res.json()
    const context = {
      models
    }

    var htmlTemplate = manageCar(context);

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'manage_car'
    toggleNavbar(route)
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

  crossroads.addRoute('/add_manufacture', function () {
    var addManufacture = Handlebars.templates['addmanufacture'];

    var htmlTemplate = addManufacture();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'add_manufacture'
    toggleNavbar(route)
  });

  crossroads.addRoute('/add_model', function () {
    var addModel = Handlebars.templates['addmodel'];


    var htmlTemplate = addModel();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'add_model'
    toggleNavbar(route)
  });

  crossroads.addRoute('/approval_list', function () {
    var approvalList = Handlebars.templates['approvalList'];

    var htmlTemplate = approvalList();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'approval_list'
    toggleNavbar(route)
  });

  crossroads.addRoute('/all_car_list', async function () {
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