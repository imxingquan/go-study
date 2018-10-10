package main

import "fmt"

func main(){

    greeting := make([]string,3,5)

    greeting[0] = "Good morin个";
    greeting[1] = "的空旷的";
    greeting[2] = "vdk kkk";
   
    greeting = append(greeting,"Supper Admin")

    fmt.Println(greeting[3])
}