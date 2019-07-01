# 嵌套模板

## 可以直接使用模板的名称嵌套
```GO
{{template "footer.html"}}
```

## 模板定义 01_define_tmpl 和使用方式
```GO
{{define "模板名称"}}
  模板内容
{{end}}

//然后使用template引用
{{template "模板名称"}}
```

## 使用template.ParseFiles 加载多个模板 01_define_tmpl
```GO
tpl,_:= template.ParseFiles("template/index.html","template/footer.html","template/header.html")
tpl.Execute(w, "Jack")
```

## 使用template.Must 加载多个模板 02_define_tmpl
```GO
tpl := template.Must(template.ParseGlob("template/*.*"))
tpl.ExecuteTemplate(w, "index.html", "Jack")
```
如果继续添加代码解析模板 tpl.ExecuteTemplate(w,"other.html") 将把other.html的内容追加到最后一个模板页的尾部!


