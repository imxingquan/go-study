package main

import (
	"net/http"
)

func main(){

	//创建多路复用器
	mux := http.NewServeMux()

	//创建静态文件服务
	//对 http://localhost:8080/static/js/jq.js 的访问去 /public 目录去找
	files := http.FileServer(http.Dir("public"))
	mux.Handle("/static/",http.StripPrefix("/static/",files))

	//处理 '/' 的请求
	mux.HandleFunc("/",index)


	server := &http.Server{
		Addr: "0.0.0.0:8080",
		Handler:mux,
	}
	server.ListenAndServe()
}

func index(writer http.ResponseWriter,request *http.Request){
	
}