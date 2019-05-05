function logout() {
  sessionStorage.clear()
  window.location.reload()
}

$(function () {
  const api_url = 'https://car-rental-system-api.herokuapp.com'
  if (sessionStorage.getItem('role') !== 'admin')
    $('.admin').hide()
  if (sessionStorage.token) {
    $('.unauthorized').hide()
    $('.authorized').show()
  } else {
    $('.unauthorized').show()
    $('.authorized').hide()
  }

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

  crossroads.addRoute('/manage_car', function () {
    var manageCar = Handlebars.templates['manageCar'];

    var htmlTemplate = manageCar();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
    const route = 'manage_car'
    toggleNavbar(route)
  });

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