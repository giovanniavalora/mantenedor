
// const httpProxy = require('http-proxy')
// const proxy = httpProxy.createProxyServer()
// const API_URL = process.env.API_URL || 'http://apiman:5000/api/v1/Proyecto/1/'

// export default function(req, res, next) {
//     console.log("Middleware!!!")
//     console.log("\n\n\n req: ",req)
//     console.log("\n\n\n res: ",res)
//     console.log("\n req.param: ",req.param)
//     console.log("\n req.body: ",req.body)
//     console.log("\n API_URL: ",API_URL)
    
//     proxy.web(req, res, {
//         target: API_URL
//     })

// }



// var express = require("express");
// var app = express();
// app.get("/", function(req, res){
//     res.send("hello world");
// });
// module.exports={
//     path: "/api/",
// };


// import axios from 'axios'
// console.log("Middleware!!!")
// export default {
//     path: 'api/v1',
//     async handler(req, res){
//         // const {data} = await axios.get(`http://apiman:5000/api/v1/Proyecto/1/`)
//         // console.log(data)
//         res.send({success: false})
//     }
// }


// export default function(req, res, next) {
//     console.log("Middleware!!!")
//     console.log(res)

//     handler(req, res) {
//         const {data} = await axios.get(`http://apiman:5000/api/v1/Proyecto/1/`)
//         console.log(data)
//         //         res.send({success: false})
//     }
//     // console.log(req)


//     next()
// }