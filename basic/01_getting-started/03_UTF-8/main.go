package main

import "fmt"

func main(){
    for i := 60; i< 128; i++{
        fmt.Printf("%d \t %b \t %x \t %q",i,i,i,i)
    }
}