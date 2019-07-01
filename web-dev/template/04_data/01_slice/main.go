package main

import (
	"html/template"
	"net/http"
)


func main() {
	http.HandleFunc("/",index)
	http.ListenAndServe(":8080",nil)

}

func index(w http.ResponseWriter,r *http.Request) {
	//使用ParseGlob批量加载
	tpl := template.Must(template.ParseGlob("template/*.*"))
	
	//切片数据
	slice := []string{"This","is","slice","data!"}
	tpl.ExecuteTemplate(w,"slice.html",slice)
}