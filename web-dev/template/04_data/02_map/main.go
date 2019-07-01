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
	
	//map data
	slice := map[string]string{
		"simple": "微笑",
		"happy": "幸福",
		"km" : "千米",
	}
	tpl.ExecuteTemplate(w,"map.html",slice)
}