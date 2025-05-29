const express = require("express");
const router = express.Router();
const Article = require("./Articles");
const slugify = require("slugify");
const Category = require("../categories/Category");

router.get("/articles/", (req, res) => {
    Article.findAll().then(articles => {
        Category.findAll().then(categories => {
            console.log("Artigos encontrados:", articles);
            console.log("Categorias encontradas:", categories);
            res.render("articles/index", { articles, categories });
        }).catch(err => {
            console.error("Erro ao buscar categorias:", err);
            res.redirect("/");
        });
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("/");
    });
});

router.get("/admin/articles/new", (req, res) =>{
    Category.findAll().then(categories => {
            console.log("Artigos encontrados:", categories);
            res.render("admin/articles/new", { categories });
        }).catch(err => {
            console.error("Erro ao buscar Artigos:", err);
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
            console.log("Artigo salvo:", article);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao salvar Artigo:", err);
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

router.get("/admin/articles/edit/:id", (req,res) => {
    var id = req.params.id;

    Category.findAll().then(categories => {
        Article.findByPk(id).then(article => {
        if(article !=undefined){
            res.render("admin/articles/edit",{article: article, categories: categories});
        }else{
            res.redirect("/admin/articles");
        }
    }).catch(erro => {
        res.redirect("/admin/articles");
    })
    })
})

//salvar edição
router.post("/articles/update", (req,res) => {
    var id = req.body.id
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.categoryId;   

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categoryId
    },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    })
})

module.exports = router;