package main

import (
	"fmt"
	"net/http"
)

func handler(writer http.ResponseWriter,request *http.Request){
	fmt.Fprintf(writer,"Hello World! %s",request.URL.Path)
}

func main(){
	http.HandleFunc("/",handler)
	http.ListenAndServe(":8080",nil)
}

//通过浏览器打开
//http://localhost:8080
//http://localhost:8080/test/abc/ttt