const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');


/* =========================
   REGISTER
========================= */

router.post('/register', (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: 'Username, email and password are required'
        });
    }

    const checkSql = `
        SELECT id
        FROM users
        WHERE email = ?
    `;

    db.query(checkSql, [email], (err, result) => {

        if (err) {
            console.error("Registration check error:", err);

            return res.status(500).json({
                error: 'Server error'
            });
        }


        /* Check if email already exists */

        if (result.length > 0) {

            return res.status(409).json({
                error: 'Email already exists'
            });

        }


        /* Hash password */

        bcrypt.hash(password, 10, (err, hashedPassword) => {

            if (err) {

                console.error("Password hash error:", err);

                return res.status(500).json({
                    error: 'Server error'
                });

            }


            const sql = `
                INSERT INTO users
                (username, email, password)
                VALUES (?, ?, ?)
            `;


            db.query(
                sql,
                [name, email, hashedPassword],
                (err, result) => {

                    if (err) {

                        console.error(
                            "Can't create this account:",
                            err
                        );

                        return res.status(500).json({
                            error: 'Server error'
                        });

                    }


                    console.log("Registered");

                    return res.status(201).json({
                        message: 'Successfully registered'
                    });

                }
           );

        });

    });

});


/* =========================
   LOGIN
========================= */

router.post('/login', (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            error: 'Email and password are required'
        });

    }


    const loginSql = `
        SELECT id, username, password
        FROM users
        WHERE email = ?
    `;


    db.query(loginSql, [email], (err, result) => {

        if (err) {

            console.error("Login database error:", err);

            return res.status(500).json({
                error: 'Server error'
            });

        }


        if (result.length === 0) {

            return res.status(401).json({
                error: 'User not found'
            });

        }


        bcrypt.compare(
            password,
            result[0].password,
            (err, match) => {

                if (err) {

                    return res.status(500).json({
                        error: 'Server error'
                    });

                }


                if (!match) {

                    return res.status(401).json({
                        error: 'Invalid credentials'
                    });

                }


                const token = JWT.sign(
                    {
                        id: result[0].id
                    },
                    process.env.JWT_SECRET
                );


                return res.status(200).json({
                    token: token
                });

            }
        );

    });

});


module.exports = router;