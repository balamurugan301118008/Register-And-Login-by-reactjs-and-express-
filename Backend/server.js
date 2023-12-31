import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "dckap",
    password: "Dckap2023Ecommerce",
    database: 'registeration'
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    }
    else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" })
            }
            else {
                req.name = decoded.name;
                req.id = decoded.id
                next();
            }
        });
    }
}


app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name, id: req.id });
})


app.post('/register', (req, res) => {
    const sql = "INSERT INTO signup (`name`,`email`,`password`) VALUES(?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error for hashing password" });

        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Inserting datas in server" })
            return res.json({ Status: "Success" })
        })
    })
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
})

app.post('/login', (req, res) => {
    const sql = 'SELECT * from signup where email = ?'
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.json({ Error: 'Login error in server' })
        }
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: 'password compare error' })
                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({ name, id: data[0].id }, 'jwt-secret-key', { expiresIn: '1d' });
                    res.cookie('token', token);
                    return res.json({ Status: 'Success' })
                }
                else {
                    return res.json({ Error: 'Password not matched' })
                }
            })
        } else {
            return res.json({ Error: 'No email existed' })
        }
    })
})


app.get('/register', (req, res) => {
    const sql = "SELECT * from signup";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json(err)
        }
        else {
            return res.json(data)
        }
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
})

app.listen(8081, () => {
    console.log("Running...")
})

app.post('/home', verifyUser, (req, res) => {
    const sql = "INSERT INTO tasks (`user_id`,taskName`,`description`) VALUES(?)";
    const values = [
        req.id,
        req.body.taskName,
        req.body.description,
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json(err)
        }
        if (res) {
            return res.json({ Status: 'Success' })
        }
        else {
            return res.json(data)
        }
    })
})

// create table tasks(
//     id int not null AUTO_INCREMENT,
//     user_id int,
//     taskName varchar(255),
//     description varchar(255),
//     created_at timestamp,
//     updated_at timestamp,
//     PRIMARY key(id),
//     FOREIGN key(user_id) REFERENCES signup(id)
//     );