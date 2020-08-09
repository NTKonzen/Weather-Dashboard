$('#citySearchInput').outerHeight($('#citySearchBtn').outerHeight());

$(document).ready(function() {
    
    $('#dateSpan').text(moment().format('L'))

    $.ajax({
        'url': 'https://api.openweathermap.org/data/2.5/weather?q=San Diego&appid=1330cf454a02f5f612b7fc468e3b4581',
        'method': 'GET'
    }).then(response => {
        console.log(response);

        $('#citySpan').text(response.name)

        $('#humiditySpan').text(response.main.humidity)

        $('#tempSpan').text((Math.floor((((response.main.temp) - 273.15) * (9/5) + 32) * 100))/100)

        $('#windSpan').text(response.wind.speed)
        $('#icon').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png')

        $.ajax({
            'url': 'http://api.openweathermap.org/data/2.5/uvi?appid=1330cf454a02f5f612b7fc468e3b4581&lat=' + response.coord.lat + '&lon=' + response.coord.lon,
            'method': 'GET'
        }).then(response => {
            $('#uvSpan').text(response.value)
        })
        
        
    })

});