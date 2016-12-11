package main

import "fmt"

func max(number ...int)int{
    var largest int
    for _, v := range number {
        if v > largest {
            largest = v 
        }
    }
    return largest
}

func main(){
    greatest := max(4,7,9,133,23,333,233,22)
    fmt.Println(greatest)

    greatest = max(-2,-3,-1,-6,-22) //error
    fmt.Println(greatest)
}

/*

for i, v := range number {
    if v > largest || i == 0{
        largest = v 
    }
}