//包中定义的变量在包的范围内有效
package main

import (
    "fmt"
    "vis"
)

func main(){
    fmt.Println(vis.MyName)
    vis.PrintVar()
}