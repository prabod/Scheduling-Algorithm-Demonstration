$(document).ready(function () {
    var i = $("#form").size() + 1;

    $("#add").click(function () {
        if (i <= 5) {
            $("#form").append("<div class='row' id='process'><div class='col-lg-4'>\
            <label>P" + i + "</label>\
            </div>\
            <div class='col-lg-4'>\
            <input type='number' min='1' max='10' class='form-control' id='burstTime" + i + "' name='process" + i + "'>\
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
        var canvas = document.getElementById('canvas');
        var two = new Two({width: 1000, height: 1000}).appendTo(canvas);
        var group = new Two.Group();
        group.translation.set(250, 250);
        group.scale = 1;
        two.add(group);
        FCFS(two, group);
        two.update();
    });

    function FCFS(two, group) {
        var process = [];
        var rectangles = [];
        var waitingTime = [0];
        var totalTime = 0;
        for (var j = 1; j < i; j++) {
            var time = $("#burstTime" + j).val();
            process.push(parseInt(time));
            totalTime += parseInt(time);
            if (j != 1) {
                var wt = 0;
                for (var k = 0; k < j - 1; k++) {
                    wt += process[k];
                }
                waitingTime.push(wt);
            }
        }
        var scale = 500 / totalTime;
        for (var j = 1; j < i; j++) {
            var rect = two.makeRectangle(scale * waitingTime[j - 1], (j) * 100, scale * process[j - 1], 100);
            rect.fill = 'rgba(' + 90 * j % 255 + ',' + 26 * j % 255 + ', ' + 60 * j % 255 + ', 0.75)';
            rect.stroke = '#1C75BC';
            two.update();
            rectangles.push(rect);
            group.add(rect);
            //sleep(process[j-1]);

        }
        console.log(waitingTime);
    }

    function sleep(seconds) {
        var e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) {
        }
    }
});

