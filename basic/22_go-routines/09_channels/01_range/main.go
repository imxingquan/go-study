package main

import (
    "fmt"
)

func main(){
    c := make(chan int)

    go func() {
        for i := 0; i < 10; i++ {
            c <- i
        }
    }()

    for n := range c {
        fmt.Println(n)
    }
}