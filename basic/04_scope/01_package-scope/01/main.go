//变量的包作用域

package main

import "fmt"

var x = 42

func main(){
    fmt.Println(x)
    foo()
}

func foo(){
    fmt.Println(x)
}