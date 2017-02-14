package main

import (
    "fmt"
)

func main(){
    c := make(chan int)
    done := make(chan bool)

    go func(){
        for i:= 0; i < 10; i++{
            c <- i
        }
        done <- true
    }()

    go func(){
        for i := 0; i < 10; i++{
            c <- i
        }
        done <- true
    }()

    <-done
    <-done
    close(c)

    for n := range c {
        fmt.Println(n)
    }
}