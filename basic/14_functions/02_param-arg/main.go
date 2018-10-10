package main

import "fmt"

func main(){
    greet("Jane")
    greet("John")
}

func greet(name string){
    fmt.Println(name)
}