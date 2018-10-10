package main

import "fmt"

func main(){
    x := 0
    increment := func()int{ //匿名函数
        x++
        return x
    }
    fmt.Println(increment())
    fmt.Println(increment())
}