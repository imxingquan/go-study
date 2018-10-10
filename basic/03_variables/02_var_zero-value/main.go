
/*
  变量未赋值都有默认的初始值
*/
package main

import "fmt"

func main(){
    var a int
    var b string
    var c float64
    var d bool

    fmt.Printf("%v \n",a)
    fmt.Printf("%v \n",b)
    fmt.Printf("%v \n",c)
    fmt.Printf("%v \n",d)

    fmt.Println()
}