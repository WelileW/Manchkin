// Chart
var Chart = new function(){
    var id = -1;
    var $main;
    var $data;
    var $in;
};

    // Init
    Chart.init = function(){
        Chart.$main = $main.find('#chart');
        Chart.$data = Chart.$main.find('input');
        Chart.$button = Chart.$main.find(".chat");
        Chart.api;

        Chart.$main.find("button").click(Chart.button);
    };
    // Create new chart or clean old
    Chart.creating = function(api){
        Chart.api = api;
        $.ajax({
            type: "GET",
            processData: false,
            contentType: 'text/plain',
            accept: 'application/json',
            data: "",
            url: "/jax-rs-boilerplate-0.1/api" + Chart.api,
            success: function (note) {
                for(var key in note) Chart.id = key;
            }
        });
        Chart.$button.html("");
    };
    // Send date to server
    Chart.button = function(){
        $.ajax({
            type: "POST",
            processData: false,
            contentType: 'text/plain',
            url: "/jax-rs-boilerplate-0.1/api" + Chart.api,
            data: nik + ": " + Chart.$data.prop("value")
        });
        Chart.$data.prop("value", ""); // очистка поля ввода
    };
    // Update. Add new note
    Chart.update = function(){
        $.ajax({
            type: "GET",
            processData: false,
            contentType: 'text/plain',
            accept: 'application/json',
            url: "/jax-rs-boilerplate-0.1/api" + Chart.api,
            data: "nik=" + nik,
            success: function (note) {
                for(var key in note)
                    var last = key;
                var up = key - Chart.id;
                Chart.id = key;
                if (up > 0) {
                    for (var i = up; i > 0; i--) {
                        Chart.$button.append("<br>" + note[Chart.id - i + 1]);
                    }
                }
            }
        })
    };
// /Chart
