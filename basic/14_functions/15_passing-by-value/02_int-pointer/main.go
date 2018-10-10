package main

import "fmt"

func main(){

    age := 44
    fmt.Println(&age) //address

    changeMe(&age)

    fmt.Println(&age) //address
    fmt.Println(age) //24
}

func changeMe(z *int){
    fmt.Println(z) //address
    fmt.Println(*z) //44
    *z = 24
    fmt.Println(z)  //address
    fmt.Println(*z) //24
}