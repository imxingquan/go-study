package main

import "fmt"

func makeGretter() func () string{
    return func()string{
        return "Hello World"
    }
}

func main(){
    greet := makeGretter()
    fmt.Println(greet())

    fmt.Printf("%T\n",greet)
}