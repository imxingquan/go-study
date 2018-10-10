
package main

import "fmt"

func main(){

    a := 43

    fmt.Println(a)
    fmt.Println(&a)

    var b = &a   //b是指向a的指针
    fmt.Println(b) 

    //fmt.Println(*b)
}