const user = require('../models/userModel')
const jwt = require('jsonwebtoken')
const schedule = require('../models/scheduleModel')


class infoController {

    // info of user
    info(req, res, next) {
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, 'datnt232', function (err, datatoken) {
                if (err) {
                    console.error(err)
                    res.render('site/page404', {
                        layout: false,
                        massage: "Xác thực tài khoản thất bại"
                    })
                }
                else {
                    user.findOne({ account: datatoken.account })
                        .then(userdata => {
                            userdata = userdata ? userdata.toObject() : userdata
                            if (userdata.role == 1 || userdata.role == 3) {
                                schedule.find({ accountuser: userdata.account })
                                    .then(schedules => {
                                        schedules = schedules.map(schedule => schedule.toObject())
                                        res.render("information/userInformation", {
                                            userdata: userdata,
                                            accountSchedules: schedules
                                        })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            }
                            if (userdata.role == 2) {
                                const accountQuery = { accountuser: userdata.account  };
                                const doctorQuery = { doctorname: userdata.name };
                            
                                const accountSchedulesPromise = schedule.find(accountQuery).exec();
                                const doctorSchedulesPromise = schedule.find(doctorQuery).exec();
                            
                                Promise.all([accountSchedulesPromise, doctorSchedulesPromise])
                                .then(([accountSchedules, doctorSchedules]) => {
                                    accountSchedules = accountSchedules.map(schedule => schedule.toObject());
                                    doctorSchedules = doctorSchedules.map(schedule => schedule.toObject());
                            
                                    res.render("information/userInformation", {
                                        userdata: userdata,
                                        accountSchedules: accountSchedules,
                                        doctorSchedules: doctorSchedules
                                    });
                                })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            }

                        })
                        .catch(err => {
                            console.error(err)
                            res.render('site/page404', {
                                layout: false,
                                massage: "Không tìm thấy dữ liệu người dùng. Hãy thử đăng nhập lại hoặc đăng ký"
                            })
                        })
                }
            })
        }
        else {
            res.redirect('/')
        }
    }

    //update information
    update(req, res, next) {
        jwt.verify(req.cookies.token, 'datnt232', function (err, tokendata) {
            if (err) {
                console.error(err)
                res.send('xác thực tài khoản thất bại, vui lòng đăng nhập lại')
            }
            else {
                user.findOne({ account: tokendata.account })
                    .then(userdata => {
                        user.updateOne({ account: userdata.account }, req.body)
                            .then(data => {
                                console.log('Update thành công')
                                console.log(data)
                                res.redirect('/information')
                            })
                            .catch(err => {
                                console.error(err)
                                res.render('site/page404', {
                                    massage: 'đã có lỗi xảy ra với sever'
                                })
                            })
                    })
                    .catch(err => console.error(err))
            }
        })
    }

}

module.exports = new infoController