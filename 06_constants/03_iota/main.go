//iota是golang语言的常量计数器,只能在常量的表达式中使用

package main

import "fmt"

const (
    a = iota //0
    b = iota //1
    c = iota //2
)

func main(){
    fmt.Println(a)
    fmt.Println(b)
    fmt.Println(c)
}