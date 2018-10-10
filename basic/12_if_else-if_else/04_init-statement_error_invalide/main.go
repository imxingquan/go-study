package main

// food 的变量作用域 在 if 语句内
import "fmt"

func main(){

    b := true

    if food := "Chocolate"; b{
        fmt.Println(food)
    }

    fmt.Println(food)
}