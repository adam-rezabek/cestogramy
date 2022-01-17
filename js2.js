/*eslint-env es6*/

/*const upper_left_N =50.0988842;
const upper_left_E =14.3441617;

const down_right_N = 50.0017114;
const down_right_E = 14.5602997;*/

const long_res = 150;
const lat_res = 60;
var lim = 0;
//const criterion = "turist1" //"fast" turist1
//const long_step = (down_right_E - upper_left_E) / long_res
//const lat_step = (down_right_N - upper_left_N) / lat_res


function moje(upper_left_N, upper_left_E, down_right_N, down_right_E, dest_lat, dest_long, criterion) {
    const long_step = (down_right_E - upper_left_E) / long_res
    const lat_step = (down_right_N - upper_left_N) / lat_res

    var table = document.getElementById("m")

    var N = upper_left_N;
    var E = upper_left_E;

    var nORi = 0;
    var last_update = 0;

    var nalezeno = function (route) {
        //console.log(route.getResults().url)
        tr = document.createElement("tr");
        n = document.createElement("td");
        e = document.createElement("td");
        time = document.createElement("td");
        ln = document.createElement("td");

        n.textContent = route.getCoords()[1]["x"];
        e.textContent = route.getCoords()[1]["y"];

        res = route.getResults();
        //coords = res.geometry
        //n.textContent = coords[coords.length - 2]["x"]
        //e.textContent = coords[coords.length - 2]["y"]

        time.textContent = res.time;
        ln.textContent = res.length;

        tr.appendChild(n);
        tr.appendChild(e);
        tr.appendChild(time);
        tr.appendChild(ln)
        table.appendChild(tr);


        nextOne();
    }

    function nextOne() {
        //50.0588517N, 14.4251694E
        //50.0479814N, 14.4547033E
        nORi++;
        if ((nORi / (lat_res * long_res)) > (last_update / 100)) {
            last_update++;
            document.getElementById("progres").textContent = last_update + " %";
        }

        var coords = [
                SMap.Coords.fromWGS84(dest_long, dest_lat),
                //SMap.Coords.fromWGS84(14.4085861, 50.0477606),
                //SMap.Coords.fromWGS84(14.4127303,50.0471333),
                    //SMap.Coords.fromWGS84(14.4312586, 50.0553914),
                SMap.Coords.fromWGS84(E, N)
            ];

        E += long_step;
        if (N < down_right_N) {
            console.log("Done");
            return;
        };
        if (E > down_right_E) {
            E = upper_left_E;
            N += lat_step;

        };
        if (last_update > lim) {
            var route = new SMap.Route(coords, nalezeno, {
                "criterion": criterion,
                "altitude": false,
                "geometry": false, //tempchange
                "itinerary": false
            })
        }
        else {nextOne()}
    }
    nextOne();
}

function tvoje(lat, long, criterion) {
    moje(50.0698281, 14.3606033, 50.0418281, 14.4605408, lat, long, criterion);

}
// Quick and simple export target #table_id into a csv
function download_table_as_csv(table_id, separator = ',') {
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [],
            cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'exxport_map_' + prompt("nazev") + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
