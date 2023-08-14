const feedback = require('../models/feedbackModel')
const user = require('../models/userModel')
const jwt = require('jsonwebtoken')

class feedbackController {

    //system quality
    system(req, res, next) {
        feedback.find({})
            .then(feedbacks => {
                feedbacks = feedbacks.map(feedback => feedback.toObject())
                if (req.cookies.token)
                    jwt.verify(req.cookies.token, "datnt232", function (err, data) {
                        if (err) {
                            console.log(err)
                            res.render('site/page404', {
                                massage: 'xác thực tài khoản thất bại'
                            })
                        }
                        else {
                            user.findOne({ account: data.account }, function (err, userdata) {
                                if (err) {
                                    console.log(err)
                                    res.render('site/page404', {
                                        massage: 'có lỗi xảy ra ở sever'
                                    })
                                }
                                else {
                                    userdata = userdata ? userdata.toObject() : userdata
                                    const filteredFeedbacks = feedbacks.filter(feedback => feedback.title === "Phản hồi về bác sĩ");
                                    res.render("feedback/system", {
                                        feedbacks: filteredFeedbacks,
                                        userdata
                                    })
                                }

                            })
                        }
                    })
                else {
                    res.render("feedback/system", {
                        feedbacks: feedbacks
                    })
                }
            })
            .catch(err => {
                console.error(err)
                res.render("feedback/system")
            })

    }

    //add feedback
    addfeedback(req, res, next) {
        console.log(req.body)
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, 'datnt232', function (err, tokendata) {
                if (err) {
                    console.error(err)
                    res.send('xác thực tài khoản thất bại')
                }
                else {
                    user.findOne({ account: tokendata.account })
                        .then(userdata => {
                            var formData = req.body
                            formData.username = userdata.name
                            formData.userrole = userdata.role
                            var feedbackdata = new feedback(formData)
                            feedbackdata.save()
                                .then(data => {
                                    console.log('thêm bình luận thành công')
                                    res.redirect('/feedback')
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.render('site/page404', {
                                        massage: 'có lỗi xảy ra ở sever'
                                    })
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).send('có lỗi xảy ra ở sever')
                        })
                }
            })
        }
        else {
            res.render('site/page404', {
                massage: 'Chưa đăng nhập vào hệ thống, hãy đăng nhập!!!',
                layout: false
            })
        }
    }

}

module.exports = new feedbackController