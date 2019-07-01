package main

import "fmt"

func main(){
    mySlice := []int{1,3,5,7,9,11}
    //print slice's type
    fmt.Printf("%T\n",mySlice)
    //print slice's value
    fmt.Println(mySlice)
}