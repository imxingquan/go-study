package main

import "fmt"

func main(){
    var name interface{} = "Sydeny"

    str, ok := name.(string)
    if ok {
        fmt.Printf("%T\n",str)
    }else{
        fmt.Printf("value is not a string\n")
    }
}