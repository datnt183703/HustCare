const infoRoute = require("./infoRoutes")
const feedbackRoute = require("./feedbackRoutes")
const siteRoute = require("./siteRoutes")
const doctorRoute = require("./doctorRoutes")

function route(app){

    //doctor
    app.use("/doctor", doctorRoute)

    //info
    app.use("/information", infoRoute)

    //feedback
    app.use("/feedback", feedbackRoute)

    //home
    app.use("/", siteRoute)

}

module.exports = route