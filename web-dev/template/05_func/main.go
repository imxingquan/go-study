package main


import (
	"html/template"
	"net/http"
	"strings"
)


func main() {
	http.HandleFunc("/",index)
	http.ListenAndServe(":8080",nil)

}

func index(w http.ResponseWriter,r *http.Request) {
	//使用ParseGlob批量加载
	
	funcs := template.FuncMap{"sub":subString,"upper":upper}
	tpl := template.New("func.html").Funcs(funcs)

	tpl,_ = tpl.ParseFiles("template/func.html","template/header.html","template/footer.html")
	
	
	data := "Hello World"
	tpl.ExecuteTemplate(w,"func.html",data)

}

func upper(str string)string{
	return strings.ToUpper(str)
}

func subString(str string,start int,length int)string{
	return str[start:length]
}