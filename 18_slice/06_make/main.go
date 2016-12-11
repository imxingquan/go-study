package main

import "fmt"

func main(){

    customerNumber := make([]int,3)
    //3 is length & capacity
    customerNumber[0] = 7
    customerNumber[1] = 10
    customerNumber[2] = 15

    greeting := make([]string,3,5)
    //3 is length
    //5 is capacity

    greeting[0] = "good";
    greeting[1] = "KKK";
    greeting[2] = "dias!";

    fmt.Println(greeting[2])

    greeting = append(greeting,"追加")

    fmt.Println(greeting);

}