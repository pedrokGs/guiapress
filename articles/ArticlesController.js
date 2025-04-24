const express = require("express");
const router = express.Router();
const Article = require("./Articles");
const slugify = require("slugify");
const Category = require("../categories/Category");

router.get("/admin/articles/new", (req, res) =>{
    Category.findAll().then(categories => {
            console.log("Categorias encontradas:", categories);
            res.render("admin/articles/new", { categories });
        }).catch(err => {
            console.error("Erro ao buscar categorias:", err);
            res.redirect("/");
        });
});

router.post("/articles/save", (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.categoryId;
    console.log("Título recebido:", title);

    if (title != undefined && title.trim() !== "") {
        Article.create({
            title: title,
            body: body,
            categoryId: categoryId,
            slug: slugify(title)
        }).then(article => {
            console.log("Categoria salva:", article);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao salvar categoria:", err);
            res.redirect("/admin/articles/new");
        });
    } else {
        res.redirect("/admin/articles/new");
    }
});

router.get("/admin/articles", (req, res) => {
    Article.findAll().then(articles => {
        Category.findAll().then(categories => {
            console.log("Artigos encontrados:", articles);
            console.log("Categorias encontradas:", categories);
            res.render("admin/articles/index", { articles, categories });
        }).catch(err => {
            console.error("Erro ao buscar categorias:", err);
            res.redirect("/");
        });
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("/");
    });
});

router.get("/admin/articles/:id", (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/articles");
    }

    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                console.log("Artigo encontrado:", article);
                console.log("Categorias encontradas:", categories);
                res.render("admin/articles/detalhes", { article, categories });
            }).catch(err => {
                console.error("Erro ao buscar categorias:", err);
                res.redirect("/admin/articles");
            });
        } else {
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        console.error("Erro ao buscar artigo:", err);
        res.redirect("/admin/articles");
    });
});


router.post("/articles/delete", (req, res) => {
    const id = req.body.id;

    if (id != undefined && !isNaN(id)) {
        Article.destroy({
            where: { id: id }
        }).then(() => {
            console.log("Artigo deletado, ID:", id);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao deletar artigo:", err);
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

module.exports = router;