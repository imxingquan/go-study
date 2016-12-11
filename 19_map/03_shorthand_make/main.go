package main

import "fmt"

func main(){

    myGreeting := make(map[string]string)

    myGreeting["Key"] = "Value"
    myGreeting["A键"] = "A值"

    fmt.Println(myGreeting)
}