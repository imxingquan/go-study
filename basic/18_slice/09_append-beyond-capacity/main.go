package main

import "fmt"

func main(){

    greeting := make([]string ,3,5)

    greeting[0] = "Good morning"
    greeting[1] = "Bongour"
    greeting[2] = "buenos dias!"

    greeting = append(greeting,"Superadmin")
    greeting = append(greeting,"k快快打开")
    greeting = append(greeting,"坎坎坷坷")
    greeting = append(greeting,"gididi")

    fmt.Println(greeting[6])
    fmt.Println(len(greeting))
    fmt.Println(cap(greeting))
}