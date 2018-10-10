package main

import "fmt"

func wrapper() func()int{
    var x int
    return func()int{
        x++
        return x
    }
}
func main(){
    increment := wrapper()
    fmt.Println(increment())
    fmt.Println(increment())
}

/*
 函数表达式可以访问函数内部的同一个变量
*/