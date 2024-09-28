$(document).ready(function(){
    //connect to the socket server.
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    var messages_received = [];
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    // 'rgba(255, 99, 132, 0.2)',
                    // 'rgba(54, 162, 235, 0.2)',
                    // 'rgba(255, 206, 86, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    // 'rgba(255,99,132,1)',
                    // 'rgba(54, 162, 235, 1)',
                    // 'rgba(255, 206, 86, 1)',
                    // 'rgba(75, 192, 192, 1)',
                    // 'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {

                legend: {
                  display: false
                }
              ,
            scales: {
    
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    //receive details from server
    socket.on('newresult', function(msg) {
        console.log("Received Flow: " + msg.result[0]);
        //maintain a list of n messages
        if (messages_received.length >= 10) {
            // Find the index of the element with the lowest value at property 11
            let lowestIndex = 0;
            let lowestValue = messages_received[0][11];
    
            for (let i = 1; i < messages_received.length; i++) {
                if (messages_received[i][11] < lowestValue) {
                    lowestValue = messages_received[i][11];
                    lowestIndex = i;
                }
            }
    
            // Remove the element with the lowest value
            messages_received.splice(lowestIndex, 1);
        }
        messages_received.push(msg.result);

        messages_string = '<tr><th>Flow ID</th><th>Src IP</th><th>Src Port</th><th>Dst IP</th><th>Dst Port</th><th>Protocol</th><th>Flow start time</th><th>Flow last seen</th><th>App name</th><th>PID</th><th>Prediction</th><th>Prob</th><th>Risk</th></tr>';

        for (var i = messages_received.length-1 ; i >= 0; i--){
            messages_string = messages_string + '<tr>';
            for (var j = 0; j <messages_received[i].length; j++){
                messages_string = messages_string + '<td>' + messages_received[i][j].toString() + '</td>'; 
            }
            messages_string = messages_string+ '<td> <a href="/flow-detail?flow_id='+messages_received[i][0].toString()+'"><div>Detail</div></a></td>' + '</tr>';

        }  
        $('#details').html(messages_string);

        // var i = 0;
        // Object.keys(msg.ips).forEach(function(key) {
        //     myChart.data.datasets[0].data[i] = msg.ips[key] ;
        //     myChart.data.labels[i] =key;
        //     i = i+1;
        //   })

        for (var i=0; i < msg.ips.length; i++) {
            myChart.data.datasets[0].data[i] =msg.ips[i].count;
            myChart.data.labels[i] =msg.ips[i].SourceIP;
           
           }
           
               myChart.update();
        myChart.update();


    });

    socket.on('stats', function(msg) {
        $('#stats').html(`Packets: ${msg.packets}<br/>Flows Active: ${msg.flows_active}<br/>Flow done: ${msg.flows}`);
    });
    socket.on('sessions', function(msg) {
        $('#sessions').html(msg.current_flows);
    });    
});



