package main

import "fmt"

func main(){

    var results []int
    fmt.Println(results)

    mySlice :=[]string{"a","b","c","g","m","z"}
    fmt.Println(mySlice)
    fmt.Println(mySlice[2:4])
    fmt.Println(mySlice[2])
    fmt.Println("myString"[2])
    fmt.Println("myString"[2:4])
    fmt.Println("myString"[:4]) //mySt
    fmt.Println("myString"[4:]) //ring
}