package main

import "fmt"

func main(){

    a := 43

    fmt.Println(a)  //43
    fmt.Println(&a) //0xaddress

    var b = &a  
    fmt.Println(b) //0xaddress
    fmt.Println(*b)  //43
}

//b是一个int指针