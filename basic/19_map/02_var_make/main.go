package main

import "fmt"

func main(){

    var myGreeting = make(map[string]string)

    myGreeting["Tim"] = "Good morinig"
    myGreeting["Jeeny"] = "Bonjour"

    fmt.Println(myGreeting)

}