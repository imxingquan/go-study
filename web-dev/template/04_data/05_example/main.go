package main

import (
	"html/template"
	"net/http"
)

func main() {
	http.HandleFunc("/", index)
	http.ListenAndServe(":8080", nil)

}

type Category struct {
	Id      int
	Name    string
	Products []Product
}

//产品
type Product struct {
	Name  string
	Price float64
	Img   string
}

func index(w http.ResponseWriter, r *http.Request) {
	//使用ParseGlob批量加载
	tpl := template.Must(template.ParseGlob("template/*.*"))

	//map data
	book1 := Product{
		Name:  "蔡康永的说话之道(套装共2册)",
		Price: 25.20,
		Img:   "https://images-na.ssl-images-amazon.com/images/I/91d9e2T6QjL._AC_UL270_SR202,270_.jpg",
	}
	book2 := Product{
		Name:  "深度思考",
		Price: 32.12,
		Img:   "https://images-na.ssl-images-amazon.com/images/I/71BVPjqtKCL._AC_UL270_SR184,270_.jpg",
	}



	cat1 := Category{
		Name: "图书",
		Id:90001,
		Products: []Product{book1,book2},
	}

	cat2 := Category{
		Name: "手机",
		Id:90002,
		Products:[]Product{
			Product{
				Name: "HUAWEI 华为 P20 Pro ",
				Img: "https://images-cn.ssl-images-amazon.com/images/I/51Tr3GADXaL._AA200_.jpg",
				Price:4387.0,
			},
			Product{
				Name: "HUAWEI 华为 Mate20 ",
				Img: "https://images-cn.ssl-images-amazon.com/images/I/51Pv7Dm8wpL._AA200_.jpg",
				Price:4329.0,
			},
		},
	}

	tpl.ExecuteTemplate(w, "struct.html", []Category{cat1,cat2})
}
