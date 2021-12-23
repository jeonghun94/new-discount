import exp from "constants";
import net from "net";
import { executeQuery } from "../server";

const renderPage = (level, res) => {
    if (level === "1") {
        res.render("home");
    } else {
        res.render("permission");
    }
};

export const postRenderHome = async (req, res) => {
    const { level } = req.body;
    renderPage(level, res);
}

export const getRenderHome = async (req, res) => {
    const { level } = req.params;

 

    renderPage(level, res);
}

export const action =  (req, res) => {
    const { action, idx } = req.query;
    let SO_PORT = '1000';

    SO_PORT += parseInt(idx) -1;

    console.log('###############################################');
    // console.log(action, SO_PORT);
    
    const socket = net.connect({ host: process.env.SO_IP, port: SO_PORT }, function() {
        socket.setTimeout(1000);
        socket.write(action);

        this.on('data', function (data) {
            const result = data.toString().trim();
            console.log(`${result}`);
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

        res.send({res:true, action:action.split('@')[2] === 'open' ? '올렸' : '내렸'});
    });
    
}; 

export const test = (req, res) => {

    executeQuery();

    
    res.render("login");
}