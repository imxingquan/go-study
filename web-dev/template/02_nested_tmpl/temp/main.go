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
	tpl := template.Must(template.ParseGlob("template/*.*"))

	tpl.ExecuteTemplate(w, "index.html", "Jack")
	
}