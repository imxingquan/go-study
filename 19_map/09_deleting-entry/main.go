package main

import "fmt"

func main(){

    myGreeting := map[string]string{
        "zero": "Good morning",
        "one" : "Bonjour",
        "two" : "Buenos dial!",
        "three": "Bonnial",
    }

    fmt.Println(myGreeting)
    delete(myGreeting,"two")
    fmt.Println(myGreeting)
}