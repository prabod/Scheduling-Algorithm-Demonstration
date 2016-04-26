$(document).ready(function () {
    var i = $("#form").size() + 1;
    var selected = "fcfs";
    var interval;
    var timer;
    $("#sjf").click(
        function () {
                selected = "sjf";
            $(this).addClass("active");
            $("#rr").removeClass("active");
            $("#fcfs").removeClass("active");
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
        });

    $("#rr").click(
        function () {
                selected = "rr";
            $(this).addClass("active");
            $("#sjf").removeClass("active");
            $("#fcfs").removeClass("active");
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
        });

    $("#fcfs").click(
        function () {
                selected = "fcfs";
            $(this).addClass("active");
            $("#rr").removeClass("active");
            $("#sjf").removeClass("active");
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
    }

    function SJF() {
        var process = [];
        var totalTime = 0;
        var elapsedTime = 0;
        for (var j = 1; j < i; j++) {
            var time = $("#burstTime" + j).val();
            var artime = $("#arrivalTime" + j).val();
            process.push({"name": "P" + j, "bt": parseInt(time), "wt": 0, "at": parseInt(artime)});
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
    }


    function RR() {
        var process = [];
        var queue = [];
        var totalTime = 0;
        var elapsedTime = 0;
        var quantum = parseInt($("#quantum").val());
        for (var j = 1; j < i; j++) {
            var time = $("#burstTime" + j).val();
            var artime = $("#arrivalTime" + j).val();
            process.push({"name": "P" + j, "bt": parseInt(time), "wt": 0, "at": parseInt(artime)});
            var no = process[j - 1].name.replace(/\D/g, '');
            $("#barpanel").append("<div class='row' id='bar" + no + "'></div>");
            totalTime += parseInt(time);
        }
        var processDup = process.slice();
        var len = process.length;
        var scale = Math.round(500 / totalTime);
        var run = false;
        queue = process.slice();
        queue.sort(compare);
        while (queue.length > 0) {
            var firstItem = queue[0];
            var j = firstItem.bt > 0 && firstItem.at <= elapsedTime ?
                firstItem.name.replace(/\D/g, '') : "no";
            if (j == "no") {
                var found = false;
                for (var t = 0; t < queue.length; t++) {
                    if (queue[t].at <= elapsedTime) {
                        found = true;
                        for (var y = 0; y < t; y++) {
                            var foo = queue.shift();
                            queue.push(foo);
                        }
                        firstItem = queue[0];
                        j = firstItem.name.replace(/\D/g, '');
                        console.log(j + 'nooo');
                        break;
                    }
                }
                if (!found) {
                    elapsedTime++;
                    for (var z = 0; z < queue.length; z++) {
                        if (z != j - 1) {
                            queue[z].wt += 1;
                        }
                    }
                    continue;
                }
            }
            firstItem = queue.shift();
            var executionTime = firstItem.bt < quantum ? firstItem.bt : quantum;
            for (var z = 0; z < queue.length; z++) {
                queue[z].wt += executionTime;
            }
            var no = firstItem.name.replace(/\D/g, '');
            var exWidth = 0;
            $("#bar" + no).children('div').each(function () {
                exWidth += $(this).width();
            });
            var width = (scale * elapsedTime) - exWidth;
            $("#bar" + no).append("" +
                "<div " +
                "style='height: 30px;float:left; position: absolute;" +
                "width:" + scale * executionTime + "px;" +
                "left: " + width + "px' " +
                "id='seg" + no + "-" + elapsedTime + "'>" +
                "</div>"
            );
            setTimeout(visualize, elapsedTime * 1000, '#seg' + no + '-' + elapsedTime, firstItem);
            firstItem.bt -= executionTime;
            elapsedTime += executionTime;
            if (firstItem.bt != 0) {
                firstItem.at = elapsedTime;
                queue.push(firstItem);
            }


        }
    }

    function schedule(p, q, eTime) {
        var index = 0;
        var min = Number.MAX_VALUE;
        var empty = true;
        q = p.slice();
        q.sort(compare);
        console.log(q);
        var dequeue = q[0].name;
        for (var k = 0; k < p.length; k++) {
            if (p[k].name == dequeue && p[k].bt > 0 && p[k].at <= eTime) {
                console.log(dequeue+'deq');
                min = p[k].bt;
                index = k;
                break;
            }
            if (p[k].bt > 0) {
                empty = false;
            }
        }
        return min == Number.MAX_VALUE ? (empty ? "true" : "no") : index + 1;
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

    function visualize(container, item) {
        var bar = new ProgressBar.Line(container, {
                strokeWidth: 4,
                easing: 'easeInOut',
                duration: item.bt * 1000,
                color: '#FFEA82',
                text: {
                    value: item.name,
                    className: 'progressbar__label',
                    style: {
                        color: '#000',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        padding: 0,
                        margin: 0,
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

    function compare(a, b) {
        if (a.at < b.at)
            return -1;
        else if (a.at > b.at)
            return 1;
        else
            return 0;
    }

});

