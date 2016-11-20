package main

import "fmt"

func main(){
    var name string
    fmt.Print("Please enter you name:")
    fmt.Scan(&name)
    fmt.Println("hello",name)
}