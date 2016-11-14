/*
    const 关键字定义常量，一旦定义不会改变
*/
package main

import "fmt"

const p = "death & taxes"

func main(){
    
    const q = 42

    fmt.Println("p -",p)
    fmt.Println("q -",q)
}