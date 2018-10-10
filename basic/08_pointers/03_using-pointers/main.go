package main

import "fmt"

func main(){

    a := 43

    fmt.Println(a)
    fmt.Println(&a)

    var b = &a
    fmt.Println(b)
    fmt.Println(*b)

    *b = 42 //改变b中地址的值为42 也就是变量a的值
    fmt.Println(a)
}