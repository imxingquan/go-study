package main

import "fmt"

func main(){

    greeting := make([]string,3,5)

    greeting[0] = "Good morin个";
    greeting[1] = "的空旷的";
    greeting[2] = "vdk kkk";
    greeting[3] = "看看vjdjdjjd"; //panic: runtime error: index out of range

    fmt.Println(greeting[2])
}