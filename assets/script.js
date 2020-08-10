$('#citySearchInput').outerHeight($('#citySearchBtn').outerHeight());

$(document).ready(function() {

    function displayWeather(city) {
        $.ajax({
            'url': 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=1330cf454a02f5f612b7fc468e3b4581',
            'method': 'GET'
        }).then(response => {
            console.log('today', response);
    
            $('#citySpan').text(response.name)
    
            $('#humiditySpan').text(response.main.humidity)
    
            $('#tempSpan').text((Math.floor((((response.main.temp) - 273.15) * (9/5) + 32) * 100))/100)
    
            $('#windSpan').text(response.wind.speed)
            $('#icon').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png')
    
            $.ajax({
                'url': 'http://api.openweathermap.org/data/2.5/uvi?appid=1330cf454a02f5f612b7fc468e3b4581&lat=' + response.coord.lat + '&lon=' + response.coord.lon,
                'method': 'GET'
            }).then(response => {
    
                if (response.value > 11) {
                    $('#uvSpan').css('background-color', 'purple')
                    $('#uvSpan').attr('class', 'rounded text-light p-1')
                } else if (response.value > 7) {
                    $('#uvSpan').css('background-color', 'red')
                    $('#uvSpan').attr('class', 'rounded text-light p-1')
                } else if (response.value > 5) {
                    $('#uvSpan').css('background-color', 'orange')
                    $('#uvSpan').attr('class', 'rounded text-light p-1')
                } else if (response.value > 2) {
                    $('#uvSpan').css('background-color', 'yellow')
                    $('#uvSpan').attr('class', 'rounded text-dark p-1')
                } else {
                    $('#uvSpan').css('background-color', 'green')
                    $('#uvSpan').attr('class', 'rounded text-light p-1')
                }
    
                $('#uvSpan').text(response.value)
            })

            $('.forecastDate').each(item => {
                $($('.forecastDate')[item]).text(moment().add(item+1, 'days').format('L'))
            })
            
            $.ajax({
                'url': 'https://api.openweathermap.org/data/2.5/forecast?q=' + city +'&appid=1330cf454a02f5f612b7fc468e3b4581',
                'method': 'GET'
            }).then(response => {
                console.log('forecast list', response);
                $('.forecastTemp').each(item => {
                    let temperature = Math.floor((response.list[item].main.temp - 273.15) * (9/5) + 32);
                    $($('.forecastTemp')[item]).text(temperature);
                    $($('.forecastHumidity')[item]).text(response.list[item].main.humidity)
                    $($('.forecastIcon')[item]).attr('src', 'http://openweathermap.org/img/w/' + response.list[item].weather[0].icon + '.png')
                    
                })
            })
    
        })
    }

    let cityArray;

    if (localStorage.getItem('cityList') === null || localStorage.getItem('cityList') === '') {
        displayWeather('San Diego')
        cityArray = ['San Diego']
        localStorage.setItem('cityList', JSON.stringify(cityArray))
        let newCity = $('<h6>')
        newCity.attr('class', 'border-bottom p-3 mb-0 text-muted font-weight-light')
        newCity.text('San Diego')
        $('#cityList').append(newCity)
    } else {
        cityArray = JSON.parse(localStorage.getItem('cityList'))

        displayWeather(cityArray[0])
        
        console.log(cityArray);
        
        $(cityArray).each(item => {

            let newCity = $('<h6>')
            newCity.attr('class', 'border-bottom p-3 mb-0 text-muted font-weight-light')
            newCity.text(cityArray[item])
            $('#cityList').append(newCity)
        })

        $('h6').click((event) => {
            console.log($(event.target).text());
    
            displayWeather($(event.target).text())
        })
        
    }
    
    $('#dateSpan').text(moment().format('L'))


    $('form').submit(event => {
        event.preventDefault();
        displayWeather($('#citySearchInput').val())
        let newCity = $('<h6>')
        newCity.addClass('border-bottom p-3 mb-0 text-muted font-weight-light');
        newCity.text($('#citySearchInput').val())
        $('#cityList').prepend(newCity)

        cityArray.unshift($('#citySearchInput').val())

        if (cityArray.length > 8) {
            cityArray.pop();

            $('h6:last-of-type').remove();
        }

        localStorage.setItem('cityList', JSON.stringify(cityArray))

        console.log(cityArray)

        $('#citySearchInput').val('')

        $('h6').click((event) => {
            console.log($(event.target).text());
    
            displayWeather($(event.target).text())
        })
    })

});