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
	//html 字符串
	tmpl :=`
		<html>
		 <body>
		   你好 {{.}}
		 </body>
		</html>
	`
	t := template.New("demo.html")
	//对模板进行语法分析
	t,_ = t.Parse(tmpl)
	
	//将"Jackson"传递到模板
	//{{.}}就表示传递到模板的数据
	t.Execute(w,"Jackson")
}