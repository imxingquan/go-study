// fallthrough 继续运行 case 下的语句
package main

import "fmt"

func main(){
    switch "A"{
        case "C":
            fmt.Println("is c")
        case "A":
            fmt.Println("is A")
            fallthrough
        case "D":
            fmt.Println("is D")
            fallthrough
        case "E":
            fmt.Println("is E")
        case "F":
            fmt.Println("is F")
    }
}