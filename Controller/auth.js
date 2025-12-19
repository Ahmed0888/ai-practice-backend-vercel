const userValue = require("../db/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function signUp(req, res) {

    try {

        const { fullName, email, password } = req.body;
        const findEmail = await userValue.findOne({ email })

        if (findEmail) {

            return res.send({
                status: 505,
                message: "User already exist! Please try another email account"
            })
        }

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {

                const user = { fullName, email, password: hash };

                const result = new userValue(user).save();

                return res.send({

                    result,
                    status: 200,
                    message: `🎉 Thank you, ${fullName}! Your details have been submitted successfully.`,
                });

            });
        });


    }
    catch (err) {

        console.log("SIGNUP ERROR:", err);

        return res.send({

            status: 500,
            message: "Sorry! Server is not responding"
        })
    }
}

async function login(req, res) {

    try {

        const { email, password } = req.body;

        const user = await userValue.findOne({ email })

        if (!user) {

            return res.send({
                status: 404,
                message: "User not found! Please try again anothor email"
            })
        }

        bcrypt.compare(password, user.password, function (err, result) {

            if (err) {

                console.log(err);

            }

            if (result) {

                let token = jwt.sign(

                    {
                        "Name": user.fullName,
                        email: user.email,
                        password: user.password
                    },
                    process.env.JWTSECRETKEY,
                    { expiresIn: "1d" }

                );

                res.cookie("jwtToken", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    sameSite: "Lax"
                });

                console.log(token);


                return res.send({

                    token,
                    result,
                    status: 200,
                    message: `🎉 Thank you, ${user.fullName}! Your details have been verify successfully.`,
                });

            }
            else {

                console.log("Your password invalid! Please try anothor password");

                return res.send({

                    status: 401,
                    message: "Your password invalid! Please try anothor password"
                })
            }

        });


    }
    catch (err) {

        console.log("SIGNUP ERROR:", err);

        return res.send({

            status: 500,
            message: "Sorry! Server is not responding"
        })
    }
}

async function home(req, res) {

    const { user } = req;
    // console.log(user, "this is line 139");

    try {

        return res.send({

            status: 200,
            message: `Welcome ${user.fullName}`,
        })

    }
    catch (err) {

        console.log("SIGNUP ERROR:", err);

        return res.send({

            status: 500,
            message: "Sorry! Server is not responding"
        })
    }
}

async function dashboard(req, res) {

    try {

        const email = req.user.email

        const companies = await companyDetails.find({ email });
        const jobs = await jobSchema.find({ email });
        const resumes = await saveResumes.find({ email });

        return res.send({

            status: 200,
            message: "Successfully Work",
            companies,
            jobs,
            resumes
        });

        // console.log(res);
        


    }
    catch (err) {

        return res.send({

            status: 500,
            message: `Sorry! Server is not responding ${err}`
        })
    }
}


module.exports = { signUp, login, home, dashboard }
