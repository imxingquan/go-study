package main

import "fmt"

func main(){
    mySlice := []string{"Monday","Tuseday"}
    myOtherSlice := []string{"Wednesday","周四","周五"}

    mySlice = append(mySlice,myOtherSlice...)

    fmt.Println(mySlice)
}