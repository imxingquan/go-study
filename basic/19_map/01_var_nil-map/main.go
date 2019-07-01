package main

import "fmt"

func main(){
    var myGreeting map[string]string

    fmt.Println(myGreeting)
    fmt.Println(myGreeting == nil)

    //output:
    // map[]
    // true

    //没有使用make会出错
    //myGreeting["Tim"] = "Good moring."
}