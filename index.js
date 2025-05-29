const express = require ("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const userController = require("./users/UsersController");

const Article = require("./articles/Articles");
const Category = require("./categories/Category");
// view engine
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));


//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log('conexão feita com sucesso');
    }).catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);

app.get("/", (req, res) => {
    Article.findAll().then(articles => {
        Category.findAll().then(categories => {
            console.log("Artigos encontrados:", articles);
            console.log("Categorias encontradas:", categories);
            res.render("index", { articles, categories });
        }).catch(err => {
            console.error("Erro ao buscar categorias:", err);
            res.redirect("index");
        });
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("index");
    });
});

app.listen(4000, () => {
    console.log("o servidor está rodando")
})