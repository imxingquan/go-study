package main

import (
	"html/template"
	"net/http"
	"math/rand"
	"time"
)


func main() {
	http.HandleFunc("/",index)
	http.ListenAndServe(":8080",nil)

}

func index(w http.ResponseWriter,r *http.Request) {
	
	tpl,_:=template.ParseFiles("index.html")
	
	rand.Seed(time.Now().Unix())

	n := rand.Intn(10);

	tpl.Execute(w,n)
}