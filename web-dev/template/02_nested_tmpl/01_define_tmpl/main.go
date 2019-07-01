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
	tpl,_:= template.ParseFiles("template/index.html","template/footer.html","template/header.html")
	
	tpl.Execute(w, "Jack")
}