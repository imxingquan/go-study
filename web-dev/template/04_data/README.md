
## 向模板输出切片数据 01

```GO
slice := []string{"This","is","slice","data!"}
tpl.ExecuteTemplate(w,"slice.html",slice)

//遍历切片
{{range .}}
    <li>{{.}}</li>
{{end}}
```

## 向模板输出map数据 02
```GO
slice := map[string]string{
		"simple": "微笑",
		"happy": "幸福",
		"km" : "千米",
}
tpl.ExecuteTemplate(w,"map.html",slice)
  
{{range $key,$value := .}}
    <li>{{$key}}-{{$value}}</li>
{{end}}
```

## 向模板输出struct数据 03

## 向模板输出[]struct数据 04

## 向模板输出复杂数据 05