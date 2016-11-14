package main

import "fmt"

func main(){
    x := 42
    fmt.Println(x)
    foo()
}

func foo(){
    //不能访问 变量x
    fmt.Println(x)
}