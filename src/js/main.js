$(document).ready(function () {
    var i = $("#form").size() + 1;

    $("#add").click(function () {
        if (i <= 5) {
            $("#form").append("<div class='row' id='process'><div class='col-lg-4'>\
            <label>P" + i + "</label>\
            </div>\
            <div class='col-lg-4'>\
            <input type='number' min='1' max='10' class='form-control' id='burstTime'" + i + " name='process'" + i + ">\
            </div>\
            <div>\
        </div>\
        </div>"
            );
            i++;
        }
    });

    $("#simulate").click(function (e) {
        e.preventDefault();
        var canvas = $("canvas");

    })
});
