package main

import (
	"html/template"
	"net/http"
)

func main() {
	http.HandleFunc("/", index)
	http.ListenAndServe(":8080", nil)

}

type Product struct {
	Name  string
	Price float64
	Img   string
}

func index(w http.ResponseWriter, r *http.Request) {
	//使用ParseGlob批量加载
	tpl := template.Must(template.ParseGlob("template/*.*"))

	//map data
	p1 := Product{
		Name:  "蔡康永的说话之道(套装共2册)",
		Price: 25.20,
		Img:   "https://images-na.ssl-images-amazon.com/images/I/91d9e2T6QjL._AC_UL270_SR202,270_.jpg",
	}
	p2 := Product{
		Name:  "深度思考",
		Price: 32.12,
		Img:   "https://images-na.ssl-images-amazon.com/images/I/71BVPjqtKCL._AC_UL270_SR184,270_.jpg",
	}

	books := []Product{p1, p2}

	tpl.ExecuteTemplate(w, "struct.html", books)
}
