$('#citySearchInput').outerHeight($('#citySearchBtn').outerHeight());

$(document).ready(function() {
    
    $('#dateSpan').text(moment().format('L'))

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
                } else if (response.value > 3) {
                    $('#uvSpan').css('background-color', 'red')
                } else if (response.value > 5) {
                    $('#uvSpan').css('background-color', 'orange')
                } else if (response.value > 2) {
                    $('#uvSpan').css('background-color', 'yellow')
                } else {
                    $('#uvSpan').css('background-color', 'green')
                }
    
                $('#uvSpan').text(response.value)
            })
            
            $.ajax({
                'url': 'https://api.openweathermap.org/data/2.5/forecast?q=' + city +'&appid=1330cf454a02f5f612b7fc468e3b4581',
                'method': 'GET'
            }).then(response => {
                console.log('forecast list', response);
                $('.forecastTemp').each(item => {
                    console.log('forecast day '+((parseInt([item]))+1), response.list[item]);
                    let temperature = Math.floor((response.list[item].main.temp - 273.15) * (9/5) + 32);
                    $($('.forecastTemp')[item]).text(temperature);
                    $($('.forecastHumidity')[item]).text(response.list[item].main.humidity)
                    $($('.forecastIcon')[item]).attr('src', 'http://openweathermap.org/img/w/' + response.list[item].weather[0].icon + '.png')
                    console.log($($('.forecastIcon')[item]).attr('src'));
                    
                })
            })
    
        })
    }

    displayWeather('San Diego')

    $('form').submit(event => {
        event.preventDefault();
        displayWeather($('#citySearchInput').val())
        let newCity = $('<h6>')
        newCity.addClass('border-bottom p-3 mb-0 text-muted font-weight-light');
        newCity.text($('#citySearchInput').val())
        $('#cityList').prepend(newCity)
        $('#citySearchInput').val('')
    })

});