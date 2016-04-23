$(document).ready(function () {
    var i = $("#form").size() + 1;
    var selected = "fcfs";
    var interval;
    var timer;
    $("#sjf").change(
        function () {
            if ($(this).is(':checked')) {
                selected = "sjf";
                $("#atH").css("display", "inline");
                $("#quantumHolder").css("display", "none");
                $("#form").empty();
                i = $("#form").size();
                $("#form").append("" +
                    "<div class='row' id='process" + i + "'>\
                        <div class='col-lg-4'>\
                            <label>P" + i + "</label>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='10' class='form-control' id='burstTime" + i + "' name='process" + i + "'>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='50' class='form-control' id='arrivalTime" + i + "' name='at" + i + "'>\
                        </div>\
                    </div>"
                );
                i++;
            }
        });

    $("#rr").change(
        function () {
            if ($(this).is(':checked')) {
                selected = "rr";
                $("#atH").css("display", "inline");
                $("#quantumHolder").css("display", "inline");
                $("#form").empty();
                i = $("#form").size();
                $("#form").append("" +
                    "<div class='row' id='process" + i + "'>\
                        <div class='col-lg-4'>\
                            <label>P" + i + "</label>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='10' class='form-control' id='burstTime" + i + "' name='process" + i + "'>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='50' class='form-control' id='arrivalTime" + i + "' name='at" + i + "'>\
                        </div>\
                    </div>"
                );
                i++;
            }
        });

    $("#fcfs").change(
        function () {
            if ($(this).is(':checked')) {
                selected = "fcfs";
                $("#atH").css("display", "none");
                $("#quantumHolder").css("display", "none");
                $("#form").empty();
                i = $("#form").size();
                $("#form").append("" +
                    "<div class='row' id='process" + i + "'>\
                        <div class='col-lg-4'>\
                            <label>P" + i + "</label>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='10' class='form-control' id='burstTime" + i + "' name='process" + i + "'>\
                        </div>\
                        <div class='col-lg-4'>\
                        </div>\
                    </div>"
                );
                i++;
            }
        });

    $("#add").click(function () {
        if (i <= 5) {
            if (selected === "fcfs") {
                $("#form").append("" +
                    "<div class='row' id='process" + i + "'>\
                        <div class='col-lg-4'>\
                            <label>P" + i + "</label>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='10' class='form-control' id='burstTime" + i + "' name='process" + i + "'>\
                        </div>\
                        <div class='col-lg-4'>\
                        </div>\
                    </div>"
                );

                i++;
            }
            else if (selected === "sjf" || selected === "rr") {
                $("#form").append("" +
                    "<div class='row' id='process" + i + "'>\
                        <div class='col-lg-4'>\
                            <label>P" + i + "</label>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='10' class='form-control' id='burstTime" + i + "' name='process" + i + "'>\
                        </div>\
                        <div class='col-lg-4'>\
                            <input type='number' min='1' max='50' class='form-control' id='arrivalTime" + i + "' name='at" + i + "'>\
                        </div>\
                    </div>"
                );
                i++;
            }
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
            timer = 1;
            interval = setInterval(function () {
                $("#timet").text(timer / 60 + "s");
                timer++
            }, 1000 / 60);
            if (selected == "sjf") {
                SJF();
            }
            else if (selected == "fcfs") {
                FCFS();
            }
            else if (selected == "rr") {
                RR();
            }
        }
        clearInterval(interval);
    });

    function FCFS() {
        var process = [];
        var rectangles = [];
        var totalTime = 0;
        for (var j = 1; j < i; j++) {
            var time = $("#burstTime" + j).val();
            totalTime += parseInt(time);
            if (j != 1) {
                var wti = 0;
                for (var k = 0; k < j - 1; k++) {
                    wti += process[k].bt;
                }
                process.push({"name": "P" + j, "bt": parseInt(time), "wt": wti});
            }
            else {
                process.push({"name": "P" + j, "bt": parseInt(time), "wt": 0});
            }
        }
        var scale = Math.round(500 / totalTime);
        for (var j = 1; j < i; j++) {
            $("#barpanel").append("<div class='row' style='height: 30px;margin-top: 5px;width:" + scale * process[j - 1].bt + "px;margin-left: " + scale * process[j - 1].wt + "px' id='bar" + j + "'></div>");
            console.log(scale * process[j - 1].wt + ' ' + scale * process[j - 1].bt);
            setTimeout(visualize, process[j - 1].wt * 1000, '#bar' + j, process[j - 1]);
        }
        if (timer == totalTime) {
            clearInterval(interval);
        }
    }

    function SJF() {
        var process = [];
        var totalTime = 0;
        var elapsedTime = 0;
        for (var j = 1; j < i; j++) {
            var time = $("#burstTime" + j).val();
            var artime = $("#arrivalTime" + j).val();
            process.push({"name": "P" + j, "bt": parseInt(time), "wt": 0, "at": artime});
            totalTime += parseInt(time);
        }
        var processDup = [];
        var scale = Math.round(500 / totalTime);
        while (process.length > 0) {
            var j = shortestJob(process, elapsedTime);
            if (j == "no") {
                elapsedTime++;
                for (var z = 0; z < process.length; z++) {
                    if (z != j - 1) {
                        process[z].wt += 1;
                    }
                }
                continue;
            }
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
        if (timer == totalTime) {
            clearInterval(interval);
        }
    }


    function RR() {
        var process = [];
        var queue = [];
        var totalTime = 0;
        var elapsedTime = 0;
        var quantum = $("#quantum").val();
        for (var j = 1; j < i; j++) {
            var time = $("#burstTime" + j).val();
            var artime = $("#arrivalTime" + j).val();
            process.push({"name": "P" + j, "bt": parseInt(time), "wt": 0, "at": artime});
            var no = process[j - 1].name.replace(/\D/g, '');
            $("#barpanel").append("<div class='row' style='height: 30px;margin-top: 5px;id='bar" + no + "'></div>");
            totalTime += parseInt(time);
        }
        var processDup = process.slice();
        var len = process.length;
        var scale = Math.round(500 / totalTime);
        var run = false;
        while (!run) {
            var j = schedule(process, queue, elapsedTime);
            if (j == "no") {
                elapsedTime++;
                for (var z = 0; z < process.length; z++) {
                    if (z != j - 1) {
                        process[z].wt += 1;
                    }
                }
                continue;
            }
            else if (j) {
                run = true;
            }
            var exTime = process[j - 1].bt < quantum ? process[j - 1].bt : quantum;
            for (var z = 0; z < process.length; z++) {
                if (z != j - 1) {
                    process[z].wt += exTime;
                }
            }
            alert($("#bar" + no).size());
            var no = process[j - 1].name.replace(/\D/g, '');
            $("#bar" + no).append("<div class='row' style='height: 30px;width:" + scale * exTime + "px;margin-left: " + scale * elapsedTime + "px' id='seg" + no + "-" + $("#bar" + no).size() + "'></div>");
            setTimeout(visualize, process[j - 1].wt * 1000, '#seg' + no + '-' + $("#bar" + no).size() - 1, process[j - 1]);
            console.log(elapsedTime + ' ' + process[j - 1].bt + ' index');
            process[j - 1].bt -= exTime;
            if (process[j - 1].bt == 0) len--;
            console.log(len);
            elapsedTime += exTime;
            process[j - 1].at = elapsedTime;
        }
    }

    function schedule(p, q, eTime) {
        var index = 0;
        var min = Number.MAX_VALUE;
        var empty = true;
        q = p.slice();
        q.sort(compare);
        var dequeue = q[0].name;
        for (var k = 0; k < p.length; k++) {
            if (p[k].name == dequeue && p[k].bt > 0 && p[k].at <= eTime) {
                min = p[k].bt;
                index = k;
                break;
            }
            if (p[k].bt > 0) {
                empty = false;
            }
        }
        return min == Number.MAX_VALUE ? (empty ? empty : "no") : index + 1;
    }

    function shortestJob(p, eTime) {
        var index = 0;
        var min = Number.MAX_VALUE;
        for (var k = 0; k < p.length; k++) {
            if (p[k].bt < min && p[k].at <= eTime) {
                min = p[k].bt;
                index = k;
            }
        }
        return min == Number.MAX_VALUE ? "no" : index + 1;
    }

    function visualize(container, duration) {
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
                step: (state, bar) = > {
                bar.path.setAttribute('stroke', state.color);
    }
    })
        bar.animate(1.0);  // Number from 0.0 to 1.0

    }

    function compare(a, b) {
        if (a.at < b.at)
            return 1;
        else if (a.at > b.at)
            return -1;
        else
            return 0;
    }

});

