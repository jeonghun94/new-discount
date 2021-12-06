require("dotenv").config();
import net from "net";

export const home = async (req, res) => {
    res.render("home");
}

export const action =  (req, res) => {
    const { action } = req.params;
    let result;

    console.log('@@@@@@@@@@@@');
    console.log(action);
    console.log('@@@@@@@@@@@@');
    
    const socket = net.connect({ host: process.env.SO_IP, port: process.env.SO_PORT }, function() {
        socket.setTimeout(1000);
        socket.write(action);

        this.on('data', function (data) {
            result = data.toString().trim();
            console.log(data);


            // if (result === "ok") {
            //     res.send({re:true, action:type});
            // } else {
            //     res.send({re:false, action:type});
            // }

            socket.end();
        });
    
        socket.on('end', function() {
            console.log('Socket Server Close...');
        });

        socket.on('error', function(err) {
            console.log('Socekt Connect Error... ', JSON.stringify(err));
            res.send({ re:false });
        });

        socket.on('close', function() {
            console.log('Socekt Connect Close...');
        });

        res.send({re:true});
    });
    
}; 