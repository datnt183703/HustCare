const user = require('../models/userModel')
const jwt = require('jsonwebtoken')
const feedback = require('../models/feedbackModel')
const countvisitor = require('../models/countvisitorModel')


class siteController {

    // home
    async index(req, res, next) {
        try {
            let visitor = await countvisitor.findOne({ id: "20183703" });

            if (!visitor) {
                visitor = await countvisitor.create({ id: "20183703", count: 0 });
            }

            visitor.count += 1;
            console.log(visitor.count)

            await visitor.save();

            res.render('site/home');
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }



    //login post
    login(req, res, next) {
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, "datnt232", function (err, data) {
                if (err) {
                    console.log(err)
                    res.render('site/page404', {
                        layout: false,
                        massage: "Xác thực tài khoản thất bại"
                    })
                }
                else {
                    user.findOne({ account: data.account })
                        .then(userdata => {
                            user.findOne({ account: req.body.account, password: req.body.password })
                                .then(data => {
                                    jwt.sign({ account: data.account }, "datnt232", function (err, token) {
                                        if (err) {
                                            console.log(err)
                                            res.render('site/page404', {
                                                layout: false,
                                                massage: "Có lỗi với tài khoản này"
                                            })
                                        }
                                        else {
                                            res.clearCookie('token')
                                            res.cookie('token', token, {
                                                maxAge: 3600 * 1000,
                                                httpOnly: true
                                            })
                                            res.redirect('/')
                                        }
                                    })
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.render('site/page404', {
                                layout: false,
                                massage: "Không tìm thấy tài khoản trên hệ thống, vui lòng đăng ký!!!"
                            })
                        })
                }
            })
        }
        else {
            user.findOne({ account: req.body.account, password: req.body.password })
                .then(data => {
                    jwt.sign({ account: data.account }, "datnt232", function (err, token) {
                        if (err) {
                            console.log(err)
                            res.render('site/page404', {
                                layout: false,
                                massage: "Có lỗi với tài khoản này"
                            })
                        }
                        else {
                            res.cookie('token', token, {
                                maxAge: 3600 * 1000 * 24,
                                httpOnly: true
                            })
                            res.redirect('/')
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.render('site/page404', {
                        layout: false,
                        massage: "Không tìm thấy tài khoản trên hệ thống, hãy đăng nhập lại hoặc tạo tài khoản mới!!!"
                    })
                })
        }
    }

    //register post
    register(req, res, next) {
        console.log(req.body)
        var formData = req.body
        formData.role = 1
        console.log(formData)
        const userdata = new user(formData)
        userdata.save()
            .then(data => {
                console.log("lưu dữ liệu thành công")
                res.redirect('/')
            })
            .catch(err => {
                console.log(err)
                res.render('site/page404', {
                    layout: false,
                    massage: "Tài khoản này đã được ký, vui lòng đăng ký tài khoản khác"
                })
            })
    }

    //admin-page
    adminpage(req, res, next) {
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, "datnt232", function (err, data) {
                if (err) {
                    console.log(err)
                    res.render('site/page404', {
                        layout: false,
                        massage: "Xác thực tài khoản thất bại"
                    })
                }
                else {
                    user.findOne({ account: data.account })
                        .then(userdata => {
                            if (userdata.role == 3) {
                                var userQuery = user.where({}).sort({ "_id": -1 }).find({})
                                userQuery.limit(15).find(function (err, users) {
                                    if (err) console.log(err)
                                    else {
                                        users = users.map(user => user.toObject())
                                        var feedbackQuery = feedback.where({}).sort({ "_id": -1 }).find({})
                                        feedbackQuery.limit(10).find(function (err, feedbacks) {
                                            if (err) console.log(err)
                                            else {
                                                user.where({ role: 1 }).count(function (err, countuser) {
                                                    user.where({ role: 2 }).count(function (err, countdoctor) {
                                                        user.where({ role: 3 }).count(function (err, countadmin) {
                                                            countvisitor.findOne({ id: "20183703" }, function (err, countvisitor1) {
                                                            const filteredFeedbacks = feedbacks.filter(feedback => feedback.title === "Phản hồi về chất lượng hệ thống");
                                                            const plainFeedbacks = filteredFeedbacks.map(feedback => feedback.toObject());
                                                            res.render('site/adminpage', {
                                                                users, 
                                                                countvisitor1: countvisitor1.count,
                                                                feedbacks: plainFeedbacks,
                                                                countuser, countdoctor, countadmin
                                                            })

                                                        })
                                                    })
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })

                            }
                            else res.render('site/page404', {
                                layout: false,
                                massage: "Bạn không thể truy cập vào trang này"
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.render('site/page404', {
                                layout: false,
                                massage: "Có lỗi trên sever"
                            })
                        })
                }
            })
        }
        else {
            res.render('site/page404', {
                layout: false,
                massage: "Bạn không thể truy cập vào trang này"
            })
        }
    }

    //logout
    logout(req, res, next) {
        res.clearCookie('token').redirect('/')
    }

}

module.exports = new siteController