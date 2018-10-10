package main

import "fmt"

func main(){

    name := "Todd"
    fmt.Println(&name) //address

    changeMe(&name)

    fmt.Println(&name) //address
    fmt.Println(name) //Rocky

}

func changeMe(z *string){
    fmt.Println(z) //address
    fmt.Println(*z) //Todd
    *z = "Rocky"
    fmt.Println(z); //address
    fmt.Println(*z) //Rocky
}