// This sets the height of the input box to the height of the search button
$('#citySearchInput').outerHeight($('#citySearchBtn').outerHeight())

$(document).ready(function () {

    // function to add a city to the search history
    function addCity() {

        // this if/else statement prevents duplicate cities in the search history
        if ($.inArray($('#citySearchInput').val(), cityArray) === -1) {

            // adds the city to the array
            cityArray.unshift($('#citySearchInput').val())

            // prevents there from being more than 8 cities in the search history
            if (cityArray.length > 8) {
                cityArray.pop();

                $('h6:last-of-type').remove();
            }

            // sets the local storage item
            localStorage.setItem('cityList', JSON.stringify(cityArray))

        } else { // this runs if the city already exists within the array

            console.log('City Already Exists in History');

            // removes the existing city from the search history element
            $($('.cityEl')[$.inArray($('#citySearchInput').val(), cityArray)]).remove();

            // removes the existing city from the array
            cityArray.splice($.inArray($('#citySearchInput').val(), cityArray), 1)

            // adds the city to the beginning of the array
            cityArray.unshift($('#citySearchInput').val())

            // sets the storage item
            localStorage.setItem('cityList', JSON.stringify(cityArray))
        }

        // adds the entered city to the search history element
        let newCity = $('<h6>')
        newCity.addClass('cityEl border-bottom p-3 mb-0 text-muted font-weight-light');
        newCity.text($('#citySearchInput').val())
        $('#cityList').prepend(newCity)

        // adds click functionality to each city in the search history element
        $('h6').click((event) => {
            console.log($(event.target).text());
            displayWeather($(event.target).text())
        })
        // clears the input
        $('#citySearchInput').val('')

        // renders the delete buttons
        renderButtons();
    }

    // renders the delete buttons on the search history
    function renderButtons() {

        // when a city is hovered over
        $('.cityEl').hover((event) => {

            // prevents duplicate buttons displaying
            if (cityArray.length > 1 && $(event.target).text() === $(event.target).html()) {

                // creates and displays the delete button 
                let deleteButton = $('<i class="fas fa-times"></i>')
                $(event.target).append(deleteButton)

                // when the 'x' icon is clicked
                $('i.fa-times').click(function (event) {
                    event.stopPropagation();

                    console.log('removed ' + $(this).parent().text());

                    // remove the associated element
                    $(this).parent().remove();
                    // removes the city from the array
                    cityArray.splice($.inArray($(this).parent().text(), cityArray), 1)
                    // resets the local storage item
                    localStorage.setItem('cityList', JSON.stringify(cityArray))
                    // displays the city at the front of the array
                    displayWeather(cityArray[0])
                })

            }

        }, event => { // when the mouse moves off the city element
            $(event.target).html($(event.target).text()); // resets the html to just the name of the city
        })

    }

    // displays the weather and the forecast
    function displayWeather(city) {
        // calls the current weather of the inputted city
        $.ajax({
            'url': 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=1330cf454a02f5f612b7fc468e3b4581',
            'method': 'GET',
            // if the call is successful
            'success': response => {
                console.log('today', response);
                
                valid = true;

                // displays the city name
                $('#citySpan').text(response.name)
                // displays the humidity
                $('#humiditySpan').text(response.main.humidity)
                // displays the temperature to the 10th degree
                $('#tempSpan').text((Math.floor((((response.main.temp) - 273.15) * (9 / 5) + 32) * 100)) / 100)
                // displays the wind speed
                $('#windSpan').text(response.wind.speed)
                // displays the weather as an icon
                $('#icon').attr('src', 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png')

                // calls the uv index from the latitude and longitude from the previous call
                $.ajax({
                    'url': 'https://api.openweathermap.org/data/2.5/uvi?appid=1330cf454a02f5f612b7fc468e3b4581&lat=' + response.coord.lat + '&lon=' + response.coord.lon,
                    'method': 'GET'
                }).then(uvresponse => {

                    // this if/else if statement sets the background color of the uv index display based on how severe it is
                    if (uvresponse.value > 11) {
                        $('#uvSpan').css('background-color', 'purple');
                        $('#uvSpan').attr('class', 'rounded text-light p-1');
                        $("body").addClass("dummyClass").removeClass("dummyClass");
                    } else if (uvresponse.value > 7) {
                        $('#uvSpan').css('background-color', 'red');
                        $('#uvSpan').attr('class', 'rounded text-light p-1');
                        $("body").addClass("dummyClass").removeClass("dummyClass");
                    } else if (uvresponse.value > 5) {
                        $('#uvSpan').css('background-color', 'orange');
                        $('#uvSpan').attr('class', 'rounded text-light p-1');
                        $("body").addClass("dummyClass").removeClass("dummyClass");
                    } else if (uvresponse.value > 2) {
                        $('#uvSpan').css('background-color', 'yellow');
                        $('#uvSpan').attr('class', 'rounded text-dark p-1');
                        $("body").addClass("dummyClass").removeClass("dummyClass");;
                    } else {
                        $('#uvSpan').css('background-color', 'green');
                        $('#uvSpan').attr('class', 'rounded text-light p-1');
                        $("body").addClass("dummyClass").removeClass("dummyClass");
                    }

                    // sets the uv display text
                    $('#uvSpan').text(uvresponse.value)
                })

                // displays the proper dates for each forecast element
                $('.forecastDate').each(item => {
                    $($('.forecastDate')[item]).text(moment().add(item + 1, 'days').format('L'))
                })

                // calls the forecast data
                $.ajax({
                    'url': 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=1330cf454a02f5f612b7fc468e3b4581',
                    'method': 'GET'
                }).then(response => {
                    console.log('forecast list', response);

                    // for each temperature span
                    $('.forecastTemp').each(timeElIndex => {

                        let item;
                        let timeAdjust;

                        // this if/else if statement ensures that the time is as close to noon as possible
                        if ((response.city.timezone / 60 / 60) < 0) {
                            timeAdjust = 12 + Math.abs(response.city.timezone / 60 / 60)
                        } else if ((response.city.timezone / 60 / 60) > 0) {
                            timeAdjust = 12 - (response.city.timezone / 60 / 60)
                        } else {
                            timeAdjust = 12
                        }

                        // rounds the adjusted time to the nearest multiple of three
                        while (Number.isInteger(timeAdjust / 3) !== true) {
                            timeAdjust++
                        }

                        timeAdjust = timeAdjust.toString()

                        // adds a 0 to the front of anything less than 10
                        if (timeAdjust.length < 2) {
                            timeAdjust = '0' + timeAdjust
                        }

                        // for each response
                        $(response.list).each(index => {
                            // only pulls the proper times from the responses
                            if (response.list[index].dt_txt === moment().add(timeElIndex + 1, 'days').format('YYYY-MM-DD') + ' ' + timeAdjust + ':00:00') {
                                item = index;
                            }
                        })

                        let temperature = Math.floor((response.list[item].main.temp_max - 273.15) * (9 / 5) + 32);

                        // displays the temperature, humidity, and weather icon of the forecast element
                        $($('.forecastTemp')[timeElIndex]).text(temperature);
                        $($('.forecastHumidity')[timeElIndex]).text(response.list[item].main.humidity)
                        $($('.forecastIcon')[timeElIndex]).attr('src', 'https://openweathermap.org/img/w/' + response.list[item].weather[0].icon + '.png')
                    })
                })

                // prevents the city from adding empty city strings
                if ($('#citySearchInput').val() !== '') {
                    addCity();
                }
            },

            'error': response => { // if an error is returned / if the call is unsuccessful
                console.log('error');
                // clears the input and alerts the viewer that the city does not exist
                $('#citySearchInput').val('')
                $('#citySearchInput').addClass('error')
                $('#citySearchInput').attr('placeholder', 'City Not Found')

                setTimeout(function () {
                    $('#citySearchInput').removeClass('error')
                    $('#citySearchInput').attr('placeholder', 'Enter City Name')
                }, 900)
            }
        });
    }

    let cityArray;

    // when the page is loaded, this sets a default search history if there is none available
    if (localStorage.getItem('cityList') === null || localStorage.getItem('cityList') === '') {

        // sets a default search history to just 'San Diego'
        displayWeather('San Diego')
        cityArray = ['San Diego']
        localStorage.setItem('cityList', JSON.stringify(cityArray))

        // adds 'San Diego' to the search history element
        let newCity = $('<h6>')
        newCity.attr('class', 'border-bottom p-3 mb-0 text-muted font-weight-light')
        newCity.text('San Diego')
        $('#cityList').append(newCity)

    } else { // if the page has been visited before, this will run

        // sets the array to the stored item
        cityArray = JSON.parse(localStorage.getItem('cityList'))

        // displays the last searched city
        displayWeather(cityArray[0])

        // adds each city to the search history element
        $(cityArray).each(item => {
            let newCity = $('<h6>')
            newCity.attr('class', 'cityEl border-bottom p-3 mb-0 text-muted font-weight-light')
            newCity.text(cityArray[item])
            $('#cityList').append(newCity)
        })

        // adds click functionality to each city 
        $('.cityEl').click((event) => {
            console.log($(event.target).text());

            displayWeather($(event.target).text())
        })

        // renders the delete buttons
        renderButtons();

    }

    // sets the date
    $('#dateSpan').text(moment().format('L'))

    // prevents the page from reloading when a new city is entered by the user
    $('form').submit(event => {

        event.preventDefault();
        displayWeather($('#citySearchInput').val())

    })

});