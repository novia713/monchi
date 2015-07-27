'use strict'

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}



$(document).ready(function() {

    var step = 0;
    var user_step = 0;
    var canon = shuffle(["☀", "☆", "☺", "✉"]);
    canon = shuffle(canon.concat(shuffle(canon)));
    //console.info(canon);
    var canon_history = [];
    var user_history = [];

    var show_symbol = function(n) {

        if (canon[n] == undefined) {
            alert(" you win :D");
            return;
        }

        if (step > 0) {
            $('#screen').css('background-color', 'green');

            setTimeout(function() {
                $('#screen').css('background-color', 'white');
            }, 500);
        }

        $('#screen').html(canon[n]).fadeIn('slow');
        canon_history.push(canon[n]);
        //console.log(canon_history);
        //console.info(canon[n]);
    }

    var get_actual_symbol = function() {
        return canon[step];
    };

    var get_contrary = function(orig) {
        var table = {
            "☀": "☂",
            "☆": "★",
            "☺": "☹",
            "✉": "✂"
        };
        return table[orig];
    };

    var show_error = function() {
        user_history = [];
        $('#screen').css('background-color', 'red');
        alert("error, volvemos a empezar");
        location.reload();
        return;
    }

    //console.info(canon);
    show_symbol(0);




    /* onclick */
    $(".btn").click(function() {
        user_step += 1;

        var s = $(this).attr('val');
        user_history.push(s);

        //check previous elems are ok

        for (var i = 1; i <= user_step; i++) {
            //console.info(i + ", " + user_step + "," + step);

            if (i == (step + 1) || (step == 0)) {

                if (get_contrary(get_actual_symbol()) == s) {
                    step = step + 1;
                    show_symbol(step);
                    user_history = [];
                    user_step = 0;
                    $("#round").html(step);

                } else {
                    show_error();
                }

            } else {
                //console.log("user → " + user_history[i - 1]);
                //console.log("canon → " + get_contrary(canon_history[i - 1]));

                if (get_contrary(canon_history[i - 1]) != user_history[i - 1]) {
                    show_error();
                }
            }

        }
    });
});
