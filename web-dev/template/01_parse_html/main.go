package main

import (
	"net/http"
	"html/template"
)

func main(){

	//创建多路复用器
	mux := http.NewServeMux()
	//处理 '/' 的请求
	mux.HandleFunc("/",index)


	server := &http.Server{
		Addr: "0.0.0.0:8080",
		Handler:mux,
	}
	server.ListenAndServe()
}

func index(w http.ResponseWriter,r *http.Request){
	//加载模板
	t,_ := template.ParseFiles("template/index.html");
	//将模板写入到ResponseWriter,并且替换需要的数据
	t.Execute(w,"Jackson");
}

//html模板处理
