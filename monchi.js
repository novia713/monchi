/*
 *  TO-DO
 *  - more functional style
 *  - internacionalisation
 */


'use strict'
var ns_utils = new function() {

    this.shuffle = function(o){
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

}


var ns_monchi = new function() {
    this.step = 0;
    this.user_step = 0;
    this.canon = ns_utils.shuffle(["😇", "🐵", "😸", "😶"]);
    this.canon_history = [];
    this.user_history = [];
    this.total = null;

    this.init_canon = function() {
        this.step = 0;
        this.user_step = 0;
        this.canon_history = [];
        this.user_history = [];
        this.total = null;

        if ($( "#dificil" ).is(":checked")) {
            this.total = 12;
            this.canon = ns_utils.shuffle(this.canon.concat(ns_utils.shuffle(this.canon)).concat(ns_utils.shuffle(this.canon)));
        }else{
            this.total = 8;
            this.canon = ns_utils.shuffle(this.canon.concat(ns_utils.shuffle(this.canon)));
        }

        $("#round").html(this.step);
        $('#total').html(this.total);
        //console.info(this.canon);
    };

    this.show_symbol = function(n) {

        if (this.canon[n] == undefined) {
            alert("Has ganado! :D\r\n Ganas 20 puntos.");
            this.save_points(this.earned_points());
            ns_monchi.init_game();
            return;
        }

        if (this.step > 0) {
            $('#screen').css('background-color', 'green');

            setTimeout(function() {
                $('#screen').css('background-color', 'white');
            }, 500);
        }

        $('#screen').html(this.canon[n]).fadeIn('slow');
        this.canon_history.push(this.canon[n]);
        //console.log(canon_history);
        //console.info(canon[n]);
    }

    this.get_actual_symbol = function() {
        return this.canon[this.step];
    };

    this.get_contrary = function(orig) {
        var table = {
            "😇": "😈",
            "🐵": "🐮",
            "😸": "😾",
            "😶": "😷"
        };
        return table[orig];
    };

    this.show_error = function() {
        this.user_history = [];
        $('#screen').css('background-color', 'red');
        alert("error, volvemos a empezar\n\r" + this.show_earned_points());
        this.save_points(this.earned_points());
        $('#screen').css('background-color', 'white');
        ns_monchi.init_game();
        return;
    }


    /* puntos */
    this.save_points = function(points){
        localStorage.setItem('monchipuntos', parseInt( points, 10) + parseInt( this.get_points(), 10));
        //localStorage.setItem('monchipuntos', 10);  //reset
    };

    this.get_points = function(){
        var points = localStorage.getItem('monchipuntos');
        return (points)? points: 0;
    };

    this.show_points = function(){
        var points = this.get_points();
        //console.log(points);
        $('#points').html(points);
    };

    this.show_earned_points = function() {
        var points = (this.step == 8)? 20 : (this.step * 10);
        return "esta vez has ganado " + points + " puntos.";
    };

    this.earned_points = function() {
        var points = (this.step == 8)? 20 : (this.step * 10);
        return points;
    };

    this.init_game = function () {
        this.show_points();
        this.init_canon();
        this.show_symbol(0);
    };
}


$(document).ready(function() {
    // easy - difficult
    $( "#dificil" ).click(function() {
        ns_monchi.init_game();
    });

    /* onclick */
    $(".btn").click(function() {
        ns_monchi.user_step += 1;

        var s = $(this).attr('val');
        ns_monchi.user_history.push(s);

        //check previous elems are ok

        for (var i = 1; i <= ns_monchi.user_step; i++) {
            //console.info(i + ", " + user_step + "," + step);

            if (i == (ns_monchi.step + 1) || (ns_monchi.step == 0)) {

                if (ns_monchi.get_contrary(ns_monchi.get_actual_symbol()) == s) {
                    ns_monchi.step = ns_monchi.step + 1;
                    ns_monchi.show_symbol(ns_monchi.step);
                    ns_monchi.user_history = [];
                    ns_monchi.user_step = 0;
                    $("#round").html(ns_monchi.step);

                } else {
                    ns_monchi.show_error();
                }

            } else {
                //console.log("user → " + user_history[i - 1]);
                //console.log("canon → " + get_contrary(canon_history[i - 1]));

                if (ns_monchi.get_contrary(ns_monchi.canon_history[i - 1]) != ns_monchi.user_history[i - 1]) {
                    ns_monchi.show_error();
                }
            }

        }
    });


    /** THE RUN **/
    ns_monchi.init_game();
    //console.info(canon);

});
