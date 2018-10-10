/*
变量定义了未使用不能通过编译
*/
package main

import "fmt"

func main(){
    a := "stored ina "
    b := "stored in b"
    fmt.Println("a -",a)
    
}

//output:
//.\main.go:7: b declared and not used