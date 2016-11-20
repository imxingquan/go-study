package main

import "fmt"

func hello(){
    fmt.Println("Hello ")
}

func world(){
    fmt.Println("world")
}

func first_run(){
    fmt.Println(" first_run")
}
func main(){
    defer world()
    hello()
    defer first_run()
}

/*
defer 延迟计算 按逆序调用
*/