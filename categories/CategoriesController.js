const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

// Rota para formulário de nova categoria
router.get("/admin/categories/new", (req, res) => {
    Category.findAll().then(categories => {
        console.log("Categorias encontradas:", categories);
        res.render("admin/categories/new", { categories });
    }).catch(err => {
        console.error("Erro ao buscar categorias:", err);
        res.redirect("/");
    });
});

// Rota para salvar categoria
router.post("/categories/save", (req, res) => {
    const title = req.body.title;
    console.log("Título recebido:", title);

    if (title != undefined && title.trim() !== "") {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(category => {
            console.log("Categoria salva:", category);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao salvar categoria:", err);
            res.redirect("/admin/categories/new");
        });
    } else {
        res.redirect("/admin/categories/new");
    }
});

router.post("/categories/edit", (req, res) => {
    Category.findByPk(req.body.id).then(category => {
        console.log("Categorias encontradas:", category);
        res.render("admin/categories/edit", { category });
    }).catch(err => {
        console.error("Erro ao buscar categorias:", err);
        res.redirect("/");
    });
});

// Rota para listagem de categorias
router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        console.log("Categorias encontradas:", categories);
        res.render("admin/categories/index", { categories });
    }).catch(err => {
        console.error("Erro ao buscar categorias:", err);
        res.redirect("/");
    });
});

// Rota para deletar uma categoria
router.post("/categories/delete", (req, res) => {
    const id = req.body.id;

    if (id != undefined && !isNaN(id)) {
        Category.destroy({
            where: { id: id }
        }).then(() => {
            console.log("Categoria deletada, ID:", id);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao deletar categoria:", err);
            res.redirect("/admin/categories");
        });
    } else {
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/:id", (req, res) => {
    var id = req.params.id;

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/edit", { category });
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(err => {
        res.redirect("/admin/categories");
    })
});


router.post('/categories/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({
        title: title,
        slug: slugify(title),
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories');
    })
})

module.exports = router;
