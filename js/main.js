$(function () {

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

  crossroads.addRoute('/home', function () {
    var homeTemplate = Handlebars.templates['home'];

    var context = { page_title: 'Home Page' };
    var htmlTemplate = homeTemplate(context);

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
  });

  crossroads.addRoute('/search_car_result', function () {
    var searchCarResult = Handlebars.templates['searchCarResult'];

    var htmlTemplate = searchCarResult();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
  });

  crossroads.addRoute('/manage_car', function () {
    var manageCar = Handlebars.templates['manageCar'];

    var htmlTemplate = manageCar();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
  });

  crossroads.addRoute('/approval_list', function () {
    var approvalList = Handlebars.templates['approvalList'];

    var htmlTemplate = approvalList();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
  });

  crossroads.addRoute('/all_car_list', function () {
    var allCarList = Handlebars.templates['allCarList'];

    var htmlTemplate = allCarList();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
  });

  crossroads.addRoute('/customer_booking_status', function () {
    var cust_booking_status = Handlebars.templates['customerBookingStatus'];

    var htmlTemplate = cust_booking_status();

    $("div#contents").empty();
    $("div#contents").html(htmlTemplate).hide().fadeIn(1000);
  });

  hasher.initialized.add(parseHash); //parse initial hash
  hasher.changed.add(parseHash); //parse hash changes
  hasher.init(); //start listening for history change

});