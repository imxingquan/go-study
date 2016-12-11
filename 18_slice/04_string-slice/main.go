package main

import "fmt"

func main(){
    greeting := []string{
        "Good Moring!",
        "你的我的",
        "Dias!",
        "Ohay!",
        "Selmat paig",
        "Gutton morgen!",
    }

    for i, currentEntry := range greeting {
        fmt.Println(i,currentEntry)
    }

    for j := 0; j < len(greeting); j++{
        fmt.Println(greeting[j])
    }
}