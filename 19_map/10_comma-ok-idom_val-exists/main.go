package main

import "fmt"

func main(){

    myGreeting := map[int]string{
        0: "Good morning!",
        1: "Bonjour",
        2: "Buneos disa!",
        3: "Bongiorno!",
    }

    fmt.Println(myGreeting)

    delete(myGreeting,2)
    
    if val, exists := myGreeting[2]; exists{
        fmt.Println("The value exists.")
        fmt.Println("val: ",val)
        fmt.Println("exists: ",exists)
    }else{
        fmt.Println("The value doesn't exist.")
        fmt.Println("val： ", val)
        fmt.Println("exists: ", exists)
    }

    fmt.Println(myGreeting)
}