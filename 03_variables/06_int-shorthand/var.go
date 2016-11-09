/*
变量的短声明方式
*/

package main

import "fmt"

func main(){

    message := "H 测试"

    a,b,c := 1,false, '3'
    d := 4
    e := true
    fmt.Println(message,a,b,c,d,e)
}