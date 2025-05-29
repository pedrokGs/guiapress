const express = require("express");
const router = express.Router();
const User = require("./Users");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        console.log("Usuários encontrados:", users);
        res.render("admin/users/index", { users });
    }).catch(err => {
        console.error("Erro ao buscar usuários:", err);
        res.redirect("/");
    });
});

router.get('/admin/users/create',(req, res) => {
    res.render("admin/users/create");
});

module.exports = router;