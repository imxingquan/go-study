package main

import (
	"html/template"
	"net/http"
)


func main() {
	http.HandleFunc("/",index)
	http.ListenAndServe(":8080",nil)

}

type book struct{
	Isbn string
	Name string
	Price float64
}


func index(w http.ResponseWriter,r *http.Request) {
	//使用ParseGlob批量加载
	tpl := template.Must(template.ParseGlob("template/*.*"))
	
	//map data
	book1 := book{
		Isbn: "ISBN-0001",
		Name: "GO LANG 教程",
		Price: 32.5,
	}
	tpl.ExecuteTemplate(w,"struct.html",book1)
}