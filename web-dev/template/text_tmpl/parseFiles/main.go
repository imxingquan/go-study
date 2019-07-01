package main

import (
	"os"
	"text/template"
)

func main(){
	//将第一个模板的内容输出
	tpl,_ := template.ParseFiles("one.txt")
	tpl.Execute(os.Stdout,nil)


	tpl,_ = template.ParseFiles("two.txt","three.txt")
	tpl.ExecuteTemplate(os.Stdout,"three.txt",nil)
	tpl.ExecuteTemplate(os.Stdout,"two.txt",nil)

	//这个没有输出
	tpl.ExecuteTemplate(os.Stdout,"one.txt",nil)
	//这个还是输出的2
	tpl.Execute(os.Stdout,nil)
}