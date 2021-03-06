

$(document).ready(function () {
    $('#search_form').submit(function (event) {



        event.preventDefault();


        var $inputs = $('#search_form :input');

        // not sure if you wanted this, but I thought I'd add it.
        // get an associative array of just the values.
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();

        });

        if (values.street &&values.street!='' && values.city &&values.city!=''  ){


            $('#nytimes').html('');
            $('#img').html('');
            $('#wikipedia').html('');


            var address = values.street +"," + values.city;
            var img = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+address+"";

            console.log("Done");
            $('#img').html('<img class="result img-fluid" src="'+img+'">')
        }
        // nytimes  api here

        $.getJSON( "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+address+"&sort=newest&api-key=ff861ea74f12409f8bb2e5433fc8c71c", function( data ) {

            var items = [];
            $.each( data.response.docs, function( key, val ) {

                items.push( "<li > <a href='"+val.web_url+"'>" + val.headline.main + "</a></li>" );
            });

            $( "<ul/>", {
                "class": "my-new-list",
                html: items.join( "" )
            }).appendTo( "#nytimes" );
        }).fail(function (e) {
            console.log(e.statusText);
        });



        // wikipedia

        var wikiURL = "https://en.wikipedia.org/w/api.php";
        wikiURL += '?' + $.param({
            'action' : 'opensearch',
            'search' : address,
            'prop'  : 'revisions',
            'rvprop' : 'content',
            'format' : 'json',
            'limit' : 10
        });

        $.ajax( {
            url: wikiURL,
            dataType: 'jsonp',
            success: function(data) {

                var items = [];
                $.each( data[1], function( key, val ) {
                    var s = data[0][key];

                    debugger
                    items.push( "<li> <a href='"+data[3][key]+"'>" + val + "</a></li>" );
                });

                $( "<ul/>", {
                    "class": "wikipedia-list",
                    html: items.join( "" )
                }).appendTo( "#wikipedia" );
            }
        } );
    })

})