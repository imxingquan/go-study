//闭包中的变量，在闭包中有效
//闭包可以访问外包中变量
package main

import "fmt"

func main(){

    x := 42
    fmt.Println(x)
    {
        fmt.Println(x)
        y := "anton是的"
        fmt.Println(y)
    }
    //undefined
    //fmt.Println(y)
}