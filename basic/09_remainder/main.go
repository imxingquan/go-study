
package main

import "fmt"

func main(){
    x := 13 % 3

    if x == 1 {
        fmt.Println("Odd")
    } else {
        fmt.Println("Even")
    }

    for i := 1; i < 70; i++ {
        if i % 2 == 1{
            fmt.Println("Odd")
        } else {
            fmt.Println("Even")
        }
    }
}