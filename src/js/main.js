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
        if (!error) {
            SJF()
        }
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
            setTimeout(visualize, waitingTime[j - 1] * 1000, '#bar' + j, process[j - 1], j);
        }
    }

    function SJF() {
        var process = [];
        var totalTime = 0;
        var elapsedTime = 0;
        for (var j = 1; j < i; j++) {
            var time = $("#burstTime" + j).val();
            process.push({"name": "P" + j, "bt": parseInt(time), "wt": 0, "at": 0,});
            totalTime += parseInt(time);
        }
        var processDup = [];
        var scale = Math.round(500 / totalTime);
        while (process.length > 0) {
            var j = shortestJob(process);
            console.log(j);
            for (var z = 0; z < process.length; z++) {
                if (z != j - 1) {
                    process[z].wt += process[j - 1].bt;
                }
            }
            var no = process[j - 1].name.replace(/\D/g, '');
            $("#barpanel").append("<div class='row' style='height: 30px;margin-top: 5px;width:" + scale * process[j - 1].bt + "px;margin-left: " + scale * elapsedTime + "px' id='bar" + no + "'></div>");
            setTimeout(visualize, process[j - 1].wt * 1000, '#bar' + no, process[j - 1]);
            console.log(elapsedTime + ' ' + process[j - 1].bt + ' index');
            elapsedTime += process[j - 1].bt;
            processDup.push(process.splice(j - 1, 1));
        }
        console.log();
    }

    function shortestJob(p) {
        var index = 0;
        var min = p[0].bt;
        for (var k = 1; k < p.length; k++) {
            if (p[k].bt < min) {
                min = p[k].bt;
                index = k;
            }
        }
        return index + 1;
    }

    function visualize(container,duration) {
        var bar = new ProgressBar.Line(container, {
            strokeWidth: 4,
            easing: 'easeInOut',
                duration: duration.bt * 1000,
            color: '#FFEA82',
                text: {
                    value: duration.name,
                    className: 'progressbar__label',
                    style: {
                        // Text color.
                        // Default: same as stroke color (options.color)
                        color: '#000',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        padding: 0,
                        margin: 0,
                        // You can specify styles which will be browser prefixed
                        transform: {
                            prefix: true,
                            value: 'translate(-50%, -50%)'
                        }
                    }

                },
            svgStyle: {width: '100%', height: '100%'},
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            step: (state, bar) => {
                bar.path.setAttribute('stroke', state.color);
            }
    })
        bar.animate(1.0);  // Number from 0.0 to 1.0

    }
});

