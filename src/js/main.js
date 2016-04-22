$(document).ready(function () {
    var i = $("#form").size()+1;


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
            console.log(i);
        }
    });

    $("#simulate").click(function (e) {
        e.preventDefault();
        var error = false;
        /*for(var k =1;k<=i;k++){
            if(!$("burstTime"+k).val()){
                $("burstTime"+k).addClass('warning');
                error = true;
            }
        }\
        */
        $("#barpanel").empty();
        if(!error){FCFS()}
    });

    function FCFS() {
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
        var scale = Math.round(500 / totalTime);
        console.log(scale);
        console.log(waitingTime);
        for (var j = 1; j < i; j++) {
            $("#barpanel").append("<div class='row' style='height: 30px;margin-top: 5px;width:"+scale * process[j - 1]+"px;margin-left: "+scale * waitingTime[j - 1]+"px' id='bar"+j+"'></div>");
            console.log(scale * waitingTime[j - 1] +' '+ scale * process[j - 1]);
            //$("#bar"+j).delay(1000);
            setTimeout(visualize,waitingTime[j - 1] *1000,'#bar'+j,process[j - 1]);
        }
        console.log(waitingTime);
    }

    function visualize(container,duration) {
        var bar = new ProgressBar.Line(container, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: duration*1000,
            color: '#FFEA82',
            svgStyle: {width: '100%', height: '100%'},
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            step: (state, bar) => {
                bar.path.setAttribute('stroke', state.color);
            }
        });

        bar.animate(1.0);  // Number from 0.0 to 1.0

    }

    function callback(duration){
        var e = new Date().getTime() + (duration * 1000);
        while (new Date().getTime() <= e) {
        }
    }
});

