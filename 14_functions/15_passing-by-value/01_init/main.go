package main

import "fmt"

func main(){
    age := 44
    changeMe(age)
    fmt.Println(age) //44
}

func changeMe(z int){
    fmt.Println(z)
    z = 24
}