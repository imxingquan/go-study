package main

import "fmt"

//并行计算func 但是没有输出
func main(){
    go foo()
    go bar()
}

func foo(){
    for i := 0; i < 45; i++ {
        fmt.Println("Foo:",i)
    }
}

func bar(){
    for i :=0 ; i< 45; i++{
        fmt.Println("Bar:",i)
    }
}