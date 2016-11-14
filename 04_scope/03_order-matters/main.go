package main

import "fmt"

func main(){
    fmt.Println(x)
    fmt.Println(y)
    x := 42 //x 需要在调用之前定义
}

var y = 42 //y 会被先初始化