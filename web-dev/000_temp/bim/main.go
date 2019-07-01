package main

import (
	"html/template"
	"net/http"
	"fmt"
	"io"
	//"os"
	"log"
	"io/ioutil"
	"strings"
)

var tpl *template.Template

func init(){
	tpl = template.Must(template.ParseGlob("template/*"))
}

func run(){

}
func main(){
	fmt.Println("The is a view BIM model application!\nFor example : http://localhost:9090/bim?path=http://47.100.125.136:8089/bim2.svlx")
	fmt.Println("The Server starting....")

	//创建静态文件服务
	files := http.FileServer(http.Dir("public"))
	
	//创建多路复用器
	mux := http.NewServeMux()
	mux.Handle("/public/",http.StripPrefix("/public/",files))
	mux.Handle("/tmp/",http.StripPrefix("/tmp/",http.FileServer(http.Dir("tmp"))))
	mux.Handle("/images/",http.StripPrefix("/images/",http.FileServer(http.Dir("public/images"))))
	//处理 '/' 的请求
	mux.HandleFunc("/bim",bimView)

	server := &http.Server{
		Addr: "0.0.0.0:9090",
		Handler:mux,
	}
	server.ListenAndServe()

	
}

func bimView(response http.ResponseWriter,request *http.Request){
	urls := request.URL.Query()
	
	if value,ok := urls["path"]; ok{
		fmt.Printf("Starting downloading bim file %s\n",value[0])

		path := download(request.FormValue("path"))
		
		tpl.ExecuteTemplate(response,"demo.html",path)
	}else{
		fmt.Fprintf(response,"not exist [path] param")
	}
}

// 下载文件到站点下临时目录tmp 保留原文件名称后缀
func download(path string) string{
	
	pos := strings.LastIndex(path,"/")
	localFile := path[pos+1:]
	
	r,_:= http.Get(path)
	localFile = "bim*-"+localFile
	tmpFile,err := ioutil.TempFile("./tmp",localFile)
	if err != nil {
		fmt.Print(err)
	}
	filename := tmpFile.Name()
	fmt.Printf("Download bim to temp file :%s\n",filename)

	if _, err := io.Copy(tmpFile,r.Body); err != nil {
		log.Fatal(err)
	}

	return tmpFile.Name()
}
